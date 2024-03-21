import { http } from "../../../../axios/init";
import { useEffect, useState } from "react";
import {
  Button,
  Spinner,
  Modal,
  Table,
  Card,
  CardGroup,
  Row,
  Col,
  Form,
  FormControl,
  Badge,
} from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import "../styles.css";
import { CgAddR } from "react-icons/cg";
import ModalAddPresets from "./modalAddPresets";
import { ModalDeletePreset } from "./modalDeletePreset";
import { ModalEditPreset } from "./modalEditPresset";
import { SkeletonText } from "@chakra-ui/react";

const ModalPresets = ({
  showModalPresets,
  setShowModalPresets,
  handleModalPresetsClose,
  getJWTToken,
  idBusiness,
}) => {
  const [showModalAssetsList, setShowModalAssetsList] = useState(false);
  const [presets, setPresets] = useState([]);
  const [listPresets, setListPresets] = useState([]);
  const [loadedAssets, setLoadedAssets] = useState(false);
  const [showModalAddPreset, setShowModalAddPreset] = useState(false);
  const [showModalDeletePreset, setShowModalDeletePreset] = useState(false);
  const [showModalEditPreset, setShowModalEditPreset] = useState(false);
  const [loadedPresets, setLoadedPresets] = useState(false);
  const [aPresets, setAPresets] = useState("");

  const handleModalAssetsListClose = () => {
    setShowModalAssetsList(false);
    setShowModalPresets(true);
    setPresets([]);
    setLoadedAssets(false);
  };
  const handleModalAddPresetClose = () => {
    setShowModalAddPreset(false);
    setShowModalPresets(true);
  };
  const handleModalDeletePresetClose = () => {
    setShowModalDeletePreset(false);
    setShowModalPresets(true);
  };
  const handleModalEditPresetClose = () => {
    setShowModalEditPreset(false);
    setShowModalPresets(true);
  };
  const getAPreset = (id) => {
    http
      .get(`presets/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        setLoadedAssets(true);
        setPresets(res.data.data.attributes.assets.data);
      });
  };
  useEffect(() => {
    setLoadedPresets(false);
    if (idBusiness && showModalPresets)
      http
        .get(
          `businesses?populate[presets][populate]=*&populate[avatar][populate]=*&filters[businessId][$eq]=${idBusiness}`,
          {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          }
        )
        .then((res) => {
          setListPresets(res.data.data[0].attributes.presets.data);
          setLoadedPresets(true);
        });
  }, [showModalAddPreset === false, showModalPresets]);

  const fillter = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("inputPreset");
    filter = input.value.toUpperCase();
    table = document.getElementById("tablePreset");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  return (
    <>
      <Modal show={showModalPresets} onHide={handleModalPresetsClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>List preset</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="custom-search-bar">
            <FormControl
              id="inputPreset"
              onKeyUp={fillter}
              type="text"
              placeholder="Search name of preset"
              style={{ width: "30% !important" }}
            />
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={(event) => {
                setShowModalAddPreset(true);
                setShowModalPresets(false);
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CgAddR style={{ marginRight: "5px" }} /> Add new preset
              </div>
            </Button>
          </Form>
          <Table
            id="tablePreset"
            striped
            bordered
            hover
            className="text-center"
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              margin: "10px 0",
            }}
          >
            <thead style={{ minHeight: "50px" }}>
              <tr>
                <th className="headerCell">PRESET NAME</th>
                <th className="headerCell">ASSETS</th>
                <th className="headerCell" style={{ width: "30%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            {loadedPresets ? (
              <tbody style={{ fontSize: "15px", fontWeight: "300" }}>
                {listPresets.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "none",
                      margin: "10px 0",
                    }}
                  >
                    Preset is empty!
                  </div>
                ) : (
                  listPresets.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            verticalAlign: "middle",
                            fontSize: "14px !important",
                            padding: "0",
                          }}
                        >
                          {data?.attributes?.preset}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            fontSize: "14px !important",
                            padding: "0",
                          }}
                        >
                          <p
                            className="linkShow"
                            onClick={() => {
                              setShowModalAssetsList(true);
                              setShowModalPresets(false);
                              getAPreset(data?.id);
                            }}
                          >
                            <Badge
                              bg="secondary"
                              style={{ padding: "5px 8px" }}
                            >
                              {data?.attributes?.assets?.data?.length}
                            </Badge>
                          </p>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "15px",
                            }}
                          >
                            <Button
                              variant="success"
                              onClick={() => {
                                setShowModalEditPreset(true);
                                setShowModalPresets(false);
                                setAPresets(
                                  data?.id + "&" + data?.attributes?.preset
                                );
                              }}
                              style={{ marginRight: "5px" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CiEdit style={{ marginRight: "5px" }} /> Edit
                              </div>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => {
                                setShowModalDeletePreset(true);
                                setShowModalPresets(false);
                                setAPresets(
                                  data?.id + "&" + data?.attributes?.preset
                                );
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <MdDeleteForever
                                  style={{ marginRight: "5px" }}
                                />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            ) : (
              <tbody style={{ fontSize: "15px", fontWeight: "300" }}>
                <tr>
                  <td>
                    <SkeletonText
                      mt="4"
                      noOfLines={4}
                      spacing="4"
                      skeletonHeight="2"
                    />
                  </td>
                  <td>
                    <SkeletonText
                      mt="4"
                      noOfLines={4}
                      spacing="4"
                      skeletonHeight="2"
                    />
                  </td>
                  <td>
                    <SkeletonText
                      mt="4"
                      noOfLines={4}
                      spacing="4"
                      skeletonHeight="2"
                    />
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalAssetsList}
        onHide={handleModalAssetsListClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assets List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <CardGroup>
            {!loadedAssets ? (
              <div>
                <br />
                <Spinner animation="border" />
              </div>
            ) : (
              <Row>
                {presets.map((data, index) => {
                  return (
                    <Col sm={4}>
                      <Card key={index}>
                        <Card.Img
                          variant="top"
                          src={data.attributes.thumbnail}
                        />
                        <Card.Body>
                          <Card.Title>{data.attributes.name}</Card.Title>
                          <Card.Text>{data.attributes.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </CardGroup>
        </Modal.Body>
      </Modal>

      {showModalAddPreset && (
        <ModalAddPresets
          showModalAddPreset={showModalAddPreset}
          handleModalAddPresetClose={handleModalAddPresetClose}
          idBusiness={idBusiness}
          getJWTToken={getJWTToken}
        />
      )}

      <ModalDeletePreset
        showModalDeletePreset={showModalDeletePreset}
        handleModalDeletePresetClose={handleModalDeletePresetClose}
        idBusiness={idBusiness}
        getJWTToken={getJWTToken}
        aPresets={aPresets}
      />

      {showModalEditPreset && (
        <ModalEditPreset
          showModalEditPreset={showModalEditPreset}
          handleModalEditPresetClose={handleModalEditPresetClose}
          idBusiness={idBusiness}
          getJWTToken={getJWTToken}
          aPresets={aPresets}
        />
      )}
    </>
  );
};

export default ModalPresets;
