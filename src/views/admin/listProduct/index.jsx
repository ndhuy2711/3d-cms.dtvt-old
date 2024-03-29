import { Box, Icon } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { http, urlStrapi } from "../../../axios/init";
import {
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import "./css.css";
import { CgAddR } from "react-icons/cg";
import { BsSearch, BsFillCheckCircleFill } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import CreateProduct from "../createProduct";
import { ImBin } from "react-icons/im";
import DeleteProduct from "./component/deleteProduct";
import { Skeleton, SkeletonText } from "@chakra-ui/react";

const ListProduct = () => {
  const fillter = () => {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };
  const location = useLocation();
  const [data, setData] = useState(null);
  const [businessId, setBusinessId] = useState("");
  const [isButtonAddDisabled, setIsButtonAddDisabled] = useState(false);
  const [isButtonDeleteDisabled, setIsButtonDeleteDisabled] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const getIDBusiness = searchParams.get("id");
  const getJWTToken = localStorage.getItem("dtvt");
  const [showModalAddProduct, setShowModalAddProduct] = useState(false);
  const handleModalAddProductClose = () => setShowModalAddProduct(false);
  const handleModalAddProductShow = () => setShowModalAddProduct(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageDelete, setSuccessMessageDelete] = useState("");
  const [dataDelete, setDataDelete] = useState([]);
  const [tokenSket, setTokenSket] = useState("");
  const [skeleton, setSkeleton] = useState(false);
  const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false);
  const handleModalDeleteProductClose = () => setShowModalDeleteProduct(false);
  const handleModalDeleteProductShow = (data) => {
    setShowModalDeleteProduct(true);
    setDataDelete(data);
  };
  const handleModalSubmitSuccess = (message) => {
    setSuccessMessage(message);
  };
  const handleModalSubmitSuccessDelete = (message) => {
    setSuccessMessageDelete(message);
  };

  const fetchAPI = useCallback(
    (getIDBusiness) => {
      http
        .get(`/businesses?filters[businessId][$eq]=${getIDBusiness}`, {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          setTokenSket(res.data.data[0].attributes.sketchfabCredentialCode);
        });
      http
        .get(`products?filters[businessId][$eq]=${getIDBusiness}&populate=*`, {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((response) => {
          const objectData = response.data.data;

          const objectsData = [...objectData];
          setData(objectsData);
          setSkeleton(false);
        })
        .catch((err) => err);
    },
    [getIDBusiness]
  );
  useEffect(() => {
    window.scrollTo(0, 0);
    if (getIDBusiness !== null) {
      setBusinessId(getIDBusiness);
      setSkeleton(true);
      fetchAPI(getIDBusiness);
    }
  }, [successMessage, successMessageDelete]);

  if (successMessage) {
    setTimeout(() => {
      setIsButtonAddDisabled(false);
      setSuccessMessage(null);
    }, 3000);
  }
  if (successMessageDelete) {
    setTimeout(() => {
      setIsButtonDeleteDisabled(false);
      setSuccessMessageDelete(null);
    }, 3000);
  }

  return (
    <>
      {successMessage && (
        <Alert
          variant="success"
          style={{
            zIndex: "1",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "5px 10px" }}
          />{" "}
          {successMessage}
        </Alert>
      )}
      {successMessage === "Fail" && (
        <Alert
          variant="danger"
          style={{
            zIndex: "1",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <TiDeleteOutline
            style={{ display: "inline", margin: "5px 10px", scale: "1.7" }}
          />{" "}
          Create new product failed
        </Alert>
      )}
      {successMessageDelete && (
        <Alert
          variant="success"
          style={{
            zIndex: "1",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "5px 10px" }}
          />{" "}
          {successMessageDelete}
        </Alert>
      )}
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <Form className="custom-search-bar">
          <FormControl
            id="myInput"
            onKeyUp={fillter}
            type="text"
            placeholder="Search name of product"
            className="mr-sm-2 custom-input"
          />
          <Button
            onClick={handleModalAddProductShow}
            variant="primary"
            style={{ margin: "15px 10px 15px 60px" }}
            disabled={isButtonAddDisabled}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CgAddR style={{ marginRight: "5px" }} /> Add new product
            </div>
          </Button>
        </Form>

        <ul id="myUL" style={{ listStyleType: "none" }}>
          {skeleton && !data && (
            <div>
              <Card.Body
                style={{
                  margin: "30px 10px",
                  borderRadius: "16px",
                  clear: "both",
                }}
              >
                <Card.Body>
                  <Row>
                    <Col xs={4} style={{ padding: "30px 0" }}>
                      <div className="d-flex justify-content-center align-items-center">
                        <div>
                          <Skeleton
                            style={{
                              width: "360px",
                              minHeight: "360px",
                            }}
                          />
                        </div>
                      </div>
                    </Col>

                    <Col xs={8} style={{ padding: "30px 32px 30px 70px" }}>
                      <SkeletonText
                        mt="4"
                        noOfLines={4}
                        spacing="4"
                        skeletonHeight="2"
                      />
                      <SkeletonText
                        mt="4"
                        noOfLines={4}
                        spacing="4"
                        skeletonHeight="2"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card.Body>
            </div>
          )}
          {data &&
            (data?.length === 0 ? (
              <div
                style={{
                  color: "#a0aec0",
                }}
              >
                Product is empty !
              </div>
            ) : (
              data.map((item, index) => (
                <li>
                  <Card
                    id="item"
                    key={index}
                    style={{
                      margin: "30px 10px",
                      borderRadius: "16px",
                      clear: "both",
                      background: "#f8f9fb",
                    }}
                  >
                    <Card.Body>
                      <Row>
                        <Col xs={4} style={{ padding: "30px 0" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <Card.Img
                              loading="lazy"
                              variant="left"
                              src={
                                urlStrapi +
                                "/" +
                                item?.attributes?.testImage?.data?.attributes
                                  ?.url
                              }
                              style={{
                                width: "360px",
                                maxHeight: "360px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </Col>

                        <Col xs={8} style={{ padding: "30px 32px 30px 70px" }}>
                          <Card.Title
                            style={{
                              marginBottom: "10px",
                              fontSize: "40px",
                              fontWeight: "bold",
                            }}
                          >
                            <a>{item?.attributes?.title}</a>
                          </Card.Title>

                          <Card.Text
                            style={{
                              margin: "16px 0px 8px 0px",
                              color: "#6C757D",
                            }}
                          >
                            Product ID: {item?.attributes?.productId}
                          </Card.Text>

                          <Card.Text
                            style={{ marginBottom: "8px", color: "#6C757D" }}
                          >
                            Models Quantity:{" "}
                            {item?.attributes?.assets?.data?.length}
                          </Card.Text>

                          {item?.attributes?.category?.data && (
                            <Card.Text
                              style={{
                                margin: "16px 0px 8px 0px",
                                color: "#6C757D",
                              }}
                            >
                              Category:{" "}
                              {
                                item?.attributes?.category?.data?.attributes
                                  ?.name
                              }
                            </Card.Text>
                          )}

                          <Card.Text
                            style={{
                              margin: "16px 0px 8px 0px",
                              color: "#6C757D",
                            }}
                          >
                            Tryout Link:{" "}
                            {item?.attributes?.tryoutLink !== "" &&
                            item?.attributes?.tryoutLink ? (
                              <a
                                target="_blank"
                                href={`${item?.attributes?.tryoutLink}`}
                              >
                                {item?.attributes?.tryoutLink}
                              </a>
                            ) : (
                              "Not Available"
                            )}
                          </Card.Text>
                          <Card.Text
                            style={{
                              margin: "16px 0px 16px 0px",
                              color: "#212529",
                              fontSize: "20px",
                              textAlign: "left",
                            }}
                          >
                            {item?.attributes?.description}
                          </Card.Text>

                          <Button variant="primary">
                            <Link
                              to={`/admin/list-products/detail-product?id=${businessId}&&productID=${item?.attributes?.productId}`}
                              className="btnView"
                            >
                              View Product Detail{" "}
                            </Link>
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="position-absolute bottom-0 end-0"
                            style={{ margin: "0px 50px 50px 0 " }}
                            onClick={
                              !isButtonDeleteDisabled
                                ? () => handleModalDeleteProductShow(item)
                                : () => {}
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                as={ImBin}
                                style={{
                                  marginRight: "5px",
                                }}
                              />
                              Delete
                            </div>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </li>
              ))
            ))}
        </ul>
        {showModalAddProduct && (
          <CreateProduct
            showModalAddProduct={showModalAddProduct}
            handleModalAddProductClose={handleModalAddProductClose}
            getJWTToken={getJWTToken}
            getIDBusiness={getIDBusiness}
            onSubmitSuccess={handleModalSubmitSuccess}
            setIsButtonAddDisabled={setIsButtonAddDisabled}
          />
        )}
        {showModalDeleteProduct && (
          <DeleteProduct
            showModalDeleteProduct={showModalDeleteProduct}
            handleModalDeleteProductClose={handleModalDeleteProductClose}
            onSubmitSuccessDelete={handleModalSubmitSuccessDelete}
            tokenSketfab={tokenSket}
            dataDelete={dataDelete}
            getJWTToken={getJWTToken}
            setIsButtonDeleteDisabled={setIsButtonDeleteDisabled}
          />
        )}
      </Box>
    </>
  );
};
export default ListProduct;
