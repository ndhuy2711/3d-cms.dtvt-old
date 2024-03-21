import { http, urlStrapi } from "../../../../axios/init";
import { useEffect, useState, useRef } from "react";
import { Modal, Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { BsFillExclamationCircleFill } from "react-icons/bs";
const ModalEditProduct = ({
  showModalEditProduct,
  handleModalEditProductClose,
  data,
  getJWTToken,
  onSubmitSuccessEdit,
  handleNewProductId,
}) => {
  const [validated, setValidated] = useState(false);
  const [category, setCategory] = useState([]);
  const [productName, setProductName] = useState(data[0].attributes.title);
  const [productId, setProductId] = useState(data[0].attributes.productId);
  const [categoryName, setCategoryName] = useState(
    data[0].attributes?.category?.data?.id
  );
  const [productTryoutLink, setProductTryoutLink] = useState(
    data[0].attributes?.tryoutLink
  );
  const [newProductId, setNewProductId] = useState(
    data[0].attributes.productId
  );
  const [productDescription, setProductDescription] = useState(
    data[0].attributes.description
  );
  const [imageSrc, setImageSrc] = useState(
    `${urlStrapi}/${data[0]?.attributes?.testImage?.data?.attributes?.url}`
  );
  const [file, setFile] = useState(null);
  const [limitedSizeThumb, setLimitedSizeThumb] = useState(false);
  const MAX_FILE_SIZE_THUMB = 300 * 1024; // KB

  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonImgDisabled, setIsButtonImgDisabled] = useState(false);
  const [alertMessageEdit, setAlertMessageEdit] = useState(false);
  const [selectOption, setSelectOption] = useState(data[0].attributes.arViewer);
  const fileInputRef = useRef(null);

  useEffect(() => {
    http
      .get(`categories`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        setCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEdit = (event) => {
    const form = event.currentTarget;

    setIsProcessing(true);
    setIsButtonDisabled(true);
    setIsButtonImgDisabled(true);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (newProductId && productName && productDescription) {
      http
        .get(`/products?filters[productId][$eq]=${newProductId}&populate=*`, {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          const duplicateId = res.data.data.length;
          if (productId !== newProductId && duplicateId > 0) {
            setAlertMessageEdit(true);
            setNewProductId("");
            setValidated(true);
            setIsProcessing(false);
            setIsButtonDisabled(false);
            setIsButtonImgDisabled(false);
          } else {
            setIsProcessing(true);
            setIsButtonDisabled(true);
            setIsButtonImgDisabled(true);
            const getID = data[0].id;
            const imgID = data[0].attributes.testImage.data.id;
            if (file === null) {
              http
                .put(
                  `/products/${getID}`,
                  {
                    data: {
                      productId: newProductId,
                      tryoutLink: productTryoutLink,
                      title: productName,
                      category: categoryName,
                      description: productDescription,
                      arViewer: selectOption,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getJWTToken}`,
                    },
                  }
                )
                .then((res) => {
                  handleModalEditProductClose();
                  setIsProcessing(false);
                  setIsButtonDisabled(false);
                  setIsButtonImgDisabled(false);
                  onSubmitSuccessEdit(
                    `Edit a product with name ${productName} was successful.`
                  );
                  handleNewProductId(newProductId);
                });
            } else {
              http
                .delete(`/upload/files/${imgID}`, {
                  headers: {
                    Authorization: `Bearer ${getJWTToken}`,
                  },
                })
                .then((res) => {
                  const dataImg = new FormData();
                  dataImg.append("files", file);
                  http
                    .post("/upload", dataImg, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${getJWTToken}`,
                      },
                    })
                    .then((res) => {
                      const imgURL = urlStrapi + res.data[0].url;
                      const imgId = res.data[0].id;
                      http
                        .put(
                          `/products/${getID}`,
                          {
                            data: {
                              productId: newProductId,
                              tryoutLink: productTryoutLink,
                              title: productName,
                              thumbnail: imgURL,
                              description: productDescription,
                              testImage: imgId,
                            },
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${getJWTToken}`,
                            },
                          }
                        )
                        .then((res) => {
                          handleModalEditProductClose();
                          setIsProcessing(false);
                          setIsButtonDisabled(false);
                          setIsButtonImgDisabled(false);
                          onSubmitSuccessEdit(
                            `Edit a product with name ${productName} was successful.`
                          );
                          handleNewProductId(newProductId);
                        });
                    });
                });
            }
          }
        });
      setValidated(false);
    }
  };
  const handleButtonImgClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > MAX_FILE_SIZE_THUMB) {
      // TODO
      setLimitedSizeThumb(true);
      setFile(null);
    } else {
      setLimitedSizeThumb(false);

      if (file) {
        setFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setImageSrc(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleChangeRadio = (e) => {
    setSelectOption(e.target.value);
  };

  const handleCloseModelEdit = () => {
    setProductId(data[0].attributes.productId);
    setNewProductId(data[0].attributes.productId);
    setProductName(data[0].attributes.title);
    setCategoryName(data[0].attributes?.category?.data?.id);
    setProductTryoutLink(data[0].attributes?.tryoutLink);
    setProductDescription(data[0].attributes.description);
    setImageSrc(
      `${urlStrapi}/${data[0]?.attributes?.testImage?.data?.attributes?.url}`
    );
    setSelectOption(data[0].attributes.arViewer);

    handleModalEditProductClose();
  };

  if (alertMessageEdit) {
    setTimeout(() => {
      setAlertMessageEdit(false);
    }, 3000);
  }
  if (limitedSizeThumb) {
    setTimeout(() => {
      setLimitedSizeThumb(false);
    }, 2000);
  }
  return (
    <>
      <Modal
        show={showModalEditProduct}
        onHide={() => {
          handleCloseModelEdit();
        }}
        size="lg"
      >
        <Modal.Header style={{ padding: "20px 20px 10px 50px" }}>
          <Modal.Title>
            <b style={{ fontSize: "32px" }}>Edit Product</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginLeft: "50px" }}>
          <p
            style={{ color: "#6c757d", marginBottom: "10px", fontSize: "14px" }}
          >
            Fill out the following details as prompted below to edit a product
            profile to your product list.
          </p>
          <Form noValidate validated={validated}>
            <Form.Group
              style={{
                float: "left",
                margin: "5px 5% 5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "25%",
              }}
            >
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product ID"
                value={newProductId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9]*$/.test(value)) {
                    setNewProductId(value);
                  } else if (value === "") {
                    setNewProductId("");
                  }
                }}
                maxLength={20}
                required
              />
              {alertMessageEdit ? (
                <div style={{ fontSize: "80%", color: "#dc3545" }}>
                  <BsFillExclamationCircleFill
                    style={{ display: "inline", margin: "5px 10px" }}
                  />
                  <b>Duplication id</b>! Please choose diferrent product id.
                </div>
              ) : (
                <Form.Control.Feedback type="invalid">
                  Please enter product id
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group
              controlId="validationProductName"
              style={{
                float: "left",
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "60%",
              }}
            >
              <Form.Label>Product name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                maxLength={30}
              />

              <Form.Control.Feedback type="invalid">
                Please enter product name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              style={{
                clear: "both",
                margin: "10px 0",
                paddingTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Form.Label>Try out link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product try out link"
                value={productTryoutLink}
                onChange={(e) => setProductTryoutLink(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              controlId="validationProductName"
              style={{
                margin: "5px 5% 5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                float: "left",
                width: "60%",
              }}
            >
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                placeholder="Enter product name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {category.map((item) => (
                  <option value={item?.id}>{item?.attributes?.name}</option>
                ))}
              </Form.Control>

              <Form.Control.Feedback type="invalid">
                Please select a category
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              className="mt-2"
              style={{
                float: "left",
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "25%",
              }}
            >
              <Form.Label>Ar Viewer</Form.Label>
              <div key="inline-radio" className="mb-1">
                <Form.Check
                  inline
                  label="Basic"
                  value="basic"
                  name="group1"
                  type="radio"
                  id="inline-radio-1"
                  checked={selectOption === "basic"}
                  onChange={handleChangeRadio}
                />
                <Form.Check
                  inline
                  label="Advanced"
                  value="advanced"
                  name="group1"
                  type="radio"
                  id="inline-radio-2"
                  checked={selectOption === "advanced"}
                  onChange={handleChangeRadio}
                />
              </div>
            </Form.Group>
            <Form.Group
              controlId="validationProductDescription"
              style={{
                clear: "both",
                margin: "10px 0",
                paddingTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Form.Label>Product description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                as="textarea"
                rows={5}
                require
                maxLength={500}
              />
              <Form.Control.Feedback type="invalid">
                Please enter product description
              </Form.Control.Feedback>
            </Form.Group>
            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Product Thumbnail</b>
              </Form.Label>
              <div>
                <Row style={{ width: "60%" }}>
                  <Col>
                    <Image src={imageSrc} rounded />
                  </Col>
                </Row>
                <br />
                <Button
                  onClick={handleButtonImgClick}
                  variant="dark"
                  disabled={isButtonImgDisabled}
                >
                  Change Image
                </Button>{" "}
              </div>
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                // required
                name="file"
                onChange={handleFileChange}
                style={{ width: "513px", display: "none" }}
                ref={fileInputRef}
                isInvalid={limitedSizeThumb}
              />
              <Form.Text className="text-muted">
                Limit the file to 300kB & format of file " .jpg, .jpeg, .png,
                .gif "
              </Form.Text>

              <Form.Control.Feedback type="invalid">
                <>
                  This file is too big to load. Please limit the file to &lt;
                  300kB
                </>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseModelEdit();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={isButtonDisabled}
          >
            Save Changes{" "}
            {isProcessing && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditProduct;
