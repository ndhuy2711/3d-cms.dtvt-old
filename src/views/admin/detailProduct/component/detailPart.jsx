import "../styleDetail.css";
import "../style/chart.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { http, urlStrapi } from "../../../../axios/init";
import Table from "react-bootstrap/Table";
import { Form, FormControl, Spinner, Image } from "react-bootstrap";
import { CgAddR } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Textarea } from "@chakra-ui/react";
import { PiWarningDiamondFill } from "react-icons/pi";
import { LineChartComponent } from "./charts";

const DetailPart = (item) => {
  const [validated, setValidated] = useState(false);
  const [showModalDetailPart, setShowModalDetailPart] = useState(false);
  const [showModalAddPart, setShowModalAddPart] = useState(false);
  const [showModalEditPart, setShowModalEditPart] = useState(false);
  const [showModalDeletePart, setShowModalDeletePart] = useState(false);
  const [part, setPart] = useState([]);
  const [partName, setPartName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [unit, setUnit] = useState("");
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [chartType, setChartType] = useState("none");
  const [chartSize, setChartSize] = useState("Small");
  const [chartOrder, setChartOrder] = useState("0");
  const [description, setDescription] = useState("");
  const [interaction, setInteraction] = useState("");
  const [arrInteraction, setArrInteraction] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [render, setRender] = useState(false);
  const [submitAdd, setSubmitAdd] = useState(false);
  const [submitEdit, setSubmitEdit] = useState(false);
  const [submitDelete, setSubmitDelete] = useState(false);
  const [aPart, setAPart] = useState([]);
  const [imgEdit, setImgEdit] = useState("");
  const [imgDisableEdit, setImgDisableEdit] = useState("block");
  const [dataKafka, setDataKafka] = useState();
  const [showModalChart, setShowModalChart] = useState(false);

  const handleModalDetailPartClose = () => setShowModalDetailPart(false);
  const handleModalAddPartClose = () => {
    setShowModalAddPart(false);
    setShowModalDetailPart(true);
  };
  const handleModalEditPartClose = () => {
    setShowModalEditPart(false);
    setShowModalDetailPart(true);
    setPartName("");
    setDisplayName("");
    setDescription("");
    setInteraction("");
    setSelectedFile(null);
  };
  const handleModalDeletePartClose = () => {
    setShowModalDeletePart(false);
    setShowModalDetailPart(true);
  };
  const handleSuccessDelelePart = () => {
    setSubmitDelete(true);
    const idPart = aPart.id;
    http
      .delete(`/parts/${idPart}`, {
        headers: {
          Authorization: `Bearer ${item.getJWTToken}`,
        },
      })
      .then((res) => {
        http
          .delete(`/upload/files/${aPart.attributes.image.data.id}`, {
            headers: {
              Authorization: `Bearer ${item.getJWTToken}`,
            },
          })
          .then((res) => {
            setShowModalDeletePart(false);
            setShowModalDetailPart(true);
            setSubmitDelete(false);
            setRender(true);
          });
      });
  };
  const INameOfSensor = {
    "Ambient Air Sensor": "ats",
    "Camshaft Position Sensor": "cps",
    "Coolant Temperature Sensor": "ect",
    "Tire Pressure Sensor": "pressure",
    ChassisSRP: "",
    "Vehicle Speed Sensor": "vss",
    "Steering Angle Sensor": "sas",
    "Oxygen Sensor": "oxys",
    "Mass Air Flow Sensor": "maf",
    "Intake Air Temperature Sensor": "iat",
    "Breaker 2": "aps",
    CarBox: "",
    "DetailItem EngineSRP": "",
  };
  useEffect(() => {
    const id = item.item.id;
    http
      .get(
        `/assets/${id}?populate[parts][populate]=image&populate[parts][populate]=part_interactions`,
        {
          headers: {
            Authorization: `Bearer ${item.getJWTToken}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.data.attributes.parts.data;
        setPart(data);
      });
    http
      .get(`/part-interactions`, {
        headers: {
          Authorization: `Bearer ${item.getJWTToken}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setArrInteraction(data);
        setInteraction(res.data.data[0].id);
        setRender(false);
      });
  }, [render]);
  useEffect(() => {
    const id = item.item.id;
    if (id === 445) {
      const ws = new WebSocket("ws://localhost:5000");

      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        // Xử lý dữ liệu và cập nhật giao diện người dùng
        setDataKafka(JSON.parse(data.value));
      };

      return () => {
        ws.close();
      };
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn
    // Kiểm tra phần mở rộng của tệp (extension)
    setImgDisableEdit("none");
    if (file === undefined) {
      setImgDisableEdit("block");
    }
    if (file) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Các phần mở rộng cho tệp ảnh
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        // Nếu phần mở rộng hợp lệ, lưu tệp vào state
        setSelectedFile(file);
      } else {
        // Nếu phần mở rộng không hợp lệ, đặt trường input về trạng thái trống
        e.target.value = null;
        setSelectedFile(null);
        console.error("Invalid file type. Please select an image file.");
      }
    }
  };
  const handleAddPart = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (
      partName &&
      displayName &&
      interaction &&
      sensorName &&
      unit &&
      chartType &&
      chartSize &&
      chartOrder &&
      selectedFile
    ) {
      let dataImg = new FormData();
      dataImg.append("files", selectedFile);
      setSubmitAdd(true);
      http
        .post("/upload", dataImg, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${item.getJWTToken}`,
          },
        })
        .then((res) => {
          const formData = {
            asset: item.item.id,
            name: partName,
            displayname: displayName,
            part_interactions: interaction,
            sensorName: sensorName,
            unit: unit,
            minValue: minValue,
            maxValue: maxValue,
            chartType: chartType,
            chartSize: chartSize,
            chartOrder: chartOrder,

            description: description,
            cover: false,
            image: res.data[0].id,
          };
          http
            .post(
              `/parts`,
              { data: formData },
              {
                headers: {
                  Authorization: `Bearer ${item.getJWTToken}`,
                },
              }
            )
            .then((res) => {
              setShowModalAddPart(false);
              setShowModalDetailPart(true);
              setSubmitAdd(false);
              setPartName("");
              setDisplayName("");
              setSensorName("");
              setUnit("");
              setMinValue(0);
              setMaxValue(0);
              setChartType("none");
              setChartOrder(0);
              setChartSize("Small");
              setSelectedFile(null);
              setValidated(false);
              setRender(true);
            });
        });
    }
  };
  const handleEditPart = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (partName && displayName && interaction) {
      if (selectedFile) {
        let dataImg = new FormData();
        dataImg.append("files", selectedFile);
        setSubmitEdit(true);
        http
          .post("/upload", dataImg, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${item.getJWTToken}`,
            },
          })
          .then((res) => {
            http
              .put(
                `/parts/${aPart.id}`,
                {
                  data: {
                    name: partName,
                    displayname: displayName,
                    description: description,
                    part_interactions:
                      interaction !== undefined ? interaction : null,
                    image: res.data[0].id,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${item.getJWTToken}`,
                  },
                }
              )
              .then((res) => {
                setSubmitEdit(false);
                setPartName("");
                setDisplayName("");
                setDescription("");
                setInteraction("");
                setShowModalEditPart(false);
                setShowModalDetailPart(true);
                setRender(true);
              })
              .catch((err) => console.log(err));
          });
      } else {
        setSubmitEdit(true);
        http
          .put(
            `/parts/${aPart.id}`,
            {
              data: {
                name: partName,
                displayname: displayName,
                description: description,
                part_interactions:
                  interaction !== undefined ? interaction : null,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${item.getJWTToken}`,
              },
            }
          )
          .then((res) => {
            setSubmitEdit(false);
            setPartName("");
            setDisplayName("");
            setDescription("");
            setInteraction("");
            setShowModalEditPart(false);
            setShowModalDetailPart(true);
            setRender(true);
          });
      }
    }
  };
  return (
    <>
      <div
        className="btnDetailPart"
        onClick={(e) => {
          e.stopPropagation();
          setShowModalDetailPart(true);
        }}
      >
        <p>Detail Part</p>
      </div>

      <Modal
        show={showModalDetailPart}
        onHide={handleModalDetailPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        size="xl"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="custom-search-bar">
            <FormControl
              id="myInput"
              type="text"
              placeholder="Search"
              className="mr-sm-2 custom-input"
              style={{ width: "30% !important" }}
            />
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={() => {
                setShowModalAddPart(true);
                setShowModalDetailPart(false);
              }}
            >
              <CgAddR style={{ display: "inline-block" }} /> Add New Part
            </Button>
          </Form>
          <Table striped className="text-center">
            <thead>
              <tr style={{ width: "100%" }}>
                <th style={{ width: "10%" }}>Name</th>
                <th
                  style={{
                    width: "25%",
                  }}
                >
                  Description
                </th>
                <th style={{ width: "20%" }}>Image</th>
                <th style={{ width: "30%" }}>Data / Line Chart</th>
                <th style={{ width: "5%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {part.map((data, index) => {
                return (
                  <tr key={index}>
                    <td style={{ verticalAlign: "middle" }}>
                      {data.attributes.displayname}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          overflowY: "hidden",
                          height: "110px",
                          paddingRight: "2px",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.overflowY = "auto"; // Hiển thị thanh cuộn khi hover
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.overflowY = "hidden"; // Ẩn thanh cuộn khi không hover
                        }}
                      >
                        {data.attributes.description}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "0",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "125px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "5%",
                            height: "100%",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                          src={`${urlStrapi}/${data?.attributes?.image?.data?.attributes?.url}`}
                          alt="null"
                        />
                      </div>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {dataKafka ? (
                        <>
                          <p
                            onClick={() => {
                              dataKafka[
                                INameOfSensor[data.attributes.displayname]
                              ] && setShowModalChart(true);
                            }}
                            style={{
                              cursor: "pointer",
                              color: "#015493",
                              marginBottom: "10px",
                            }}
                          >
                            Data :{" "}
                            <b>
                              {dataKafka[
                                INameOfSensor[data.attributes.displayname]
                              ] || "_"}{" "}
                            </b>
                          </p>
                          {dataKafka[
                            INameOfSensor[data.attributes.displayname]
                          ] && (
                            <div>
                              <LineChartComponent
                                data={{
                                  data: dataKafka[
                                    INameOfSensor[data.attributes.displayname]
                                  ],
                                }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        0
                      )}
                    </td>
                    <td
                      style={{
                        padding: "0",
                        verticalAlign: "middle",
                      }}
                    >
                      <Button
                        variant="success"
                        style={{ margin: "5px" }}
                        onClick={() => {
                          setAPart(data);
                          setPartName(data?.attributes?.name);
                          setDisplayName(data?.attributes?.displayname);
                          setDescription(data?.attributes?.description);
                          setInteraction(
                            data?.attributes?.part_interactions?.data[0]?.id ||
                              1
                          );
                          setImgEdit(
                            data?.attributes?.image?.data?.attributes?.url
                          );
                          setShowModalEditPart(true);
                          setShowModalDetailPart(false);
                          setImgDisableEdit("block");
                        }}
                      >
                        <CiEdit style={{ display: "inline-block" }} />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setAPart(data);
                          setShowModalDeletePart(true);
                          setShowModalDetailPart(false);
                        }}
                      >
                        <MdDeleteForever style={{ display: "inline-block" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalAddPart}
        onHide={handleModalAddPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group
              controlId="validationAssetName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Asset name</Form.Label>

              <Form.Control
                type="text"
                value={item.item.attributes.name}
                disabled
              />
            </Form.Group>

            <Form.Group
              controlId="validationPartName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Name of part"
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationDisplayName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Display name</Form.Label>

              <Form.Control
                type="text"
                value={displayName}
                placeholder="Display name of part"
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter display name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationPartInteraction"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part Interaction</Form.Label>

              <Form.Select
                onChange={(e) => {
                  setInteraction(e.target.value);
                }}
                required
              >
                {arrInteraction.map((data, index) => {
                  return (
                    <option key={index} value={data.id}>
                      {data.attributes.name}
                    </option>
                  );
                })}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter part interaction
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              controlId="validationChartType"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Chart type</Form.Label>

              <Form.Select
                onChange={(e) => {
                  setChartType(e.target.value);
                }}
                required
              >
                <option value="none">none</option>
                <option value="CircularProgress001">CircularProgress001</option>
                <option value="CircularProgress003">CircularProgress003</option>
                <option value="CircularProgress004">CircularProgress004</option>
                <option value="Wavecircle1">Wavecircle1</option>
                <option value="BarChart">BarChart</option>
                <option value="BarChartTwoColumn01">BarChartTwoColumn01</option>
                <option value="BarChartTwoColumn02">BarChartTwoColumn02</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter chart type
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationChartSize"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Chart size</Form.Label>

              <Form.Select
                onChange={(e) => {
                  setChartSize(e.target.value);
                }}
                required
              >
                <option value="Small">Small</option>
                <option value="Large">Large</option>
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter chart size
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationChartOrder"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Chart order</Form.Label>

              <Form.Control
                type="number"
                value={chartOrder}
                placeholder="Chart order"
                onChange={(e) => {
                  setChartOrder(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter chart order
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationSensorName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Sensor name</Form.Label>

              <Form.Control
                type="text"
                value={sensorName}
                placeholder="Sensor name"
                onChange={(e) => {
                  setSensorName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter sensor name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationUnit"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Unit</Form.Label>

              <Form.Control
                type="text"
                value={unit}
                placeholder="Unit"
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter unit
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationMinValue"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Min Value</Form.Label>

              <Form.Control
                type="number"
                value={minValue}
                placeholder="Min Value"
                onChange={(e) => {
                  setMinValue(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter min value
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationMaxValue"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Max Value</Form.Label>

              <Form.Control
                type="number"
                value={maxValue}
                placeholder="Max Value"
                onChange={(e) => {
                  setMaxValue(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter max value
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              controlId="validationDescription"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                clear: "both",
              }}
            >
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                as={Textarea}
                rows={5}
              />
            </Form.Group>

            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Image</b>
              </Form.Label>

              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                required
                name="file"
                onChange={handleFileChange}
              />

              <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalAddPartClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPart}
            disabled={submitAdd}
          >
            Save Changes
            {submitAdd && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalDeletePart}
        onHide={handleModalDeletePartClose}
        centered
      >
        <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
          <Modal.Title style={{ display: "flex", flexDirection: "row" }}>
            <PiWarningDiamondFill
              style={{ color: "red", scale: "1.2", marginRight: "12px" }}
            />
            <b style={{ fontSize: "20px" }}>Are you sure?</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ paddingLeft: "50px" }}>
          <p>
            Your action will delete the part with name{" "}
            <b>{aPart?.attributes?.displayname}</b>. Please beware this action
            CANNOT be undone.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleModalDeletePartClose} variant="secondary">
            Cancel{" "}
          </Button>

          <Button
            onClick={handleSuccessDelelePart}
            variant="danger"
            disabled={submitDelete}
          >
            Yes, delete{" "}
            {submitDelete && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalEditPart}
        onHide={handleModalEditPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group
              controlId="validationAssetName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Asset name</Form.Label>

              <Form.Control
                type="text"
                value={item.item.attributes.name}
                disabled
              />
            </Form.Group>

            <Form.Group
              controlId="validationPartName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part name</Form.Label>

              <Form.Control
                type="text"
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationDisplayName"
              style={{
                margin: "5px 10px 5px 0",
                float: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Display name</Form.Label>

              <Form.Control
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter display name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationPartInteraction"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "5px 10px 5px 0",
                float: "left",
              }}
            >
              <Form.Label>Part Interaction</Form.Label>

              <Form.Select
                value={interaction}
                onChange={(e) => {
                  setInteraction(e.target.value);
                }}
                required
              >
                {arrInteraction.map((data, index) => {
                  return (
                    <option key={index} value={data.id}>
                      {data.attributes.name}
                    </option>
                  );
                })}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter part interaction
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationDescription"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                clear: "both",
              }}
            >
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                as={Textarea}
                rows={5}
              />
            </Form.Group>

            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Image</b>
              </Form.Label>
              <Image
                src={`${urlStrapi}/${imgEdit}`}
                rounded
                style={{ width: "30%", display: imgDisableEdit }}
              />
              <br />
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                name="file"
                onChange={handleFileChange}
              />

              <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalEditPartClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEditPart}
            disabled={submitEdit}
          >
            Save Changes
            {submitEdit && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DetailPart;
