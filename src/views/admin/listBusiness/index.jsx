import {
  Table,
  Modal,
  Button,
  FormControl,
  Alert,
  Form,
  Badge,
} from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { http, urlStrapi } from "../../../axios/init";
import "./styles.css";
import { CgAddR, CgCodeSlash } from "react-icons/cg";
import { FaRegCopy } from "react-icons/fa";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import ModalAddNewPartner from "./component/modalAddNewPartner";
import ModalAddPeople from "./component/modalAddPeople";
import {
  roleManagerAll,
  roleManagerBusiness,
  roleUser,
} from "../../../const/roles";
import ModalPresets from "./component/modalPresets";
import ModalProjectName from "./component/modalProjectName";
import ModalAddProjectName from "./component/modalAddProjectName";
import { SkeletonText } from "@chakra-ui/react";
import avatar from "../../../assets/img/avatar.jpg";

const ListBusiness = () => {
  const getJWTToken = localStorage.getItem("dtvt");
  var decoded = jwt_decode(getJWTToken);
  const idUser = decoded.id;
  const [data, setData] = useState([]);
  const [dataAzureCredential, setDataAzureCredential] = useState({});
  const [showModalSnippet, setShowModalSnippet] = useState(false);
  const [showModalAddPeople, setShowModalAddPeople] = useState(false);
  const [showModalPresets, setShowModalPresets] = useState(false);
  const [codeIntegrationHead, setCodeIntegrationHead] = useState("");
  const [codeIntegrationBody, setCodeIntegrationBody] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageAddPartner, setSuccessMessageAddPartner] = useState("");
  const [successMessageAddPeople, setSuccessMessageAddPeople] = useState("");
  const [showModalAddPartner, setShowModalAddPartner] = useState(false);
  const [showModalProjectName, setShowModalProjectName] = useState(false);
  const [showModalAddProjectName, setShowModalAddProjectName] = useState(false);
  const [isButtonAddDisabled, setIsButtonAddDisabled] = useState(false);
  const [isButtonAddPeopleDisabled, setIsButtonAddPeopleDisabled] =
    useState(false);
  const [idBusiness, setIdBusiness] = useState("");
  const [roleName, setRoleName] = useState("");
  const handleModalAddPartnerClose = () => setShowModalAddPartner(false);
  const handleModalAddPartnerShow = () => setShowModalAddPartner(true);
  const handleModalSnippetClose = () => {
    setCodeIntegrationHead("");
    setCodeIntegrationBody("");
    setShowModalSnippet(false);
  };
  const handleModalSnippetShow = (item) => {
    setCodeIntegrationHead(item?.attributes?.codeIntegrationHead);
    setCodeIntegrationBody(item?.attributes?.codeIntegrationBody);
    setShowModalSnippet(true);
  };

  const handleModaAddPeopleShow = () => {
    setShowModalAddPeople(true);
  };
  const handleModaPresetsShow = () => {
    setShowModalPresets(true);
  };
  const handleModalAddPeopleClose = () => {
    setShowModalAddPeople(false);
  };
  const handleModalPresetsClose = () => {
    setShowModalPresets(false);
  };
  const fillter = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
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

  const fetchAPIRoleManagerAll = () => {
    http
      .get(
        `businesses?populate[presets][populate]=*&populate[avatar][populate]=*&populate[azure_credential][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        }
      )
      .then((response) => {
        const objectData = response.data.data;
        const objectsData = [...objectData];
        setData(objectsData);
      })
      .catch((err) => err);
  };
  const fetchAPIRoleManagerBusiness = (businessID) => {
    http
      .get(
        `businesses?populate[presets][populate]=*&populate[avatar][populate]=*&populate[azure_credential][populate]=*&filters[businessId][$eq]=${businessID}`,
        {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        }
      )
      .then((response) => {
        const objectData = response.data.data;
        const objectsData = [...objectData];
        setData(objectsData);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    http
      .get(`users?populate=*&filters[id][$eq]=${idUser}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((result) => {
        const role = result.data[0].role.name;
        const businessID = result.data[0].businessId;
        const checkRoleManagerAll = roleManagerAll.find(
          (item) => item.role === role
        );
        const checkRoleManagerBusiness = roleManagerBusiness.find(
          (item) => item.role === role
        );
        const checkRoleUser = roleUser.find((item) => item.role === role);
        switch (role) {
          case checkRoleManagerAll?.role:
            fetchAPIRoleManagerAll();
            setRoleName("roleManagerAll");
            break;
          case checkRoleManagerBusiness?.role:
            fetchAPIRoleManagerBusiness(businessID);
            setRoleName("roleManagerBusiness");
            break;
          case checkRoleUser?.role:
            fetchAPIRoleManagerBusiness(businessID);
            setRoleName("checkRoleUser");
            break;
          default:
            break;
        }
      });
  }, [
    successMessageAddPartner,
    showModalPresets === false,
    showModalProjectName === false,
    showModalAddProjectName === false,
  ]);
  const copyToClipboard = (value) => {
    // Sử dụng API Clipboard để sao chép văn bản vào clipboard
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setSuccessMessage("Copy Success");
      })
      .catch((err) => {});
  };

  const handleModalSubmitSuccess = (message) => {
    setSuccessMessageAddPartner(message);
  };
  const handleModalAddPeopleSubmitSuccess = (message) => {
    setSuccessMessageAddPeople(message);
  };
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  }
  if (successMessageAddPartner) {
    setTimeout(() => {
      setIsButtonAddDisabled(false);
      setSuccessMessageAddPartner(null);
    }, 3000);
  }
  if (successMessageAddPeople) {
    setTimeout(() => {
      setIsButtonAddPeopleDisabled(false);
      setSuccessMessageAddPeople(null);
    }, 3000);
  }
  return (
    <>
      {successMessage && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          {successMessage}
        </Alert>
      )}
      {successMessageAddPartner && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          {successMessageAddPartner}
        </Alert>
      )}
      {successMessageAddPartner === "Fail" && (
        <Alert
          variant="danger"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <TiDeleteOutline style={{ display: "inline", margin: "0 5px" }} /> Add
          new partnet Failed.
        </Alert>
      )}

      {successMessageAddPeople && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          <b>Success : </b>
          {successMessageAddPeople}
        </Alert>
      )}
      {successMessageAddPeople === "Fail" && (
        <Alert
          variant="danger"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <TiDeleteOutline style={{ display: "inline", margin: "0 5px" }} />{" "}
          <b>Fail : </b>Username or email is duplicate. Add new peole failed!
        </Alert>
      )}
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }} w="100%">
        <Form className="custom-search-bar">
          <FormControl
            type="text"
            placeholder="Search name of business"
            className="mr-sm-2 custom-input search"
            id="myInput"
            onKeyUp={fillter}
          />
          {roleName !== "checkRoleUser" ? (
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={handleModalAddPartnerShow}
              disabled={isButtonAddDisabled}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CgAddR style={{ marginRight: "5px" }} /> Add new partner{" "}
              </div>
            </Button>
          ) : (
            ""
          )}
        </Form>

        <Table
          id="myTable"
          striped
          bordered
          hover
          className="text-center"
          style={{ borderRadius: "15px", overflow: "hidden", margin: "10px 0" }}
        >
          <thead style={{ minHeight: "50px" }}>
            <tr>
              <th className="headerCell">NAME OF BUSINESS</th>
              <th className="headerCell">CLIENT ID NUMBER</th>
              <th className="headerCell">PERSON IN CHARGE</th>
              <th className="headerCell">PRESET</th>
              <th className="headerCell">ACTION</th>
            </tr>
          </thead>
          {data.length === 0 ? (
            <tbody>
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
          ) : (
            <tbody style={{ fontSize: "15px", fontWeight: "300" }}>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "40%",
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingRight: "10px",
                          }}
                        >
                          <img
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                            src={`${urlStrapi}/${item?.attributes?.avatar?.data?.attributes?.url}`}
                            alt="null"
                          />
                        </div>
                        <div
                          style={{
                            width: "60%",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Link
                            to={`list-product?id=${item?.attributes?.businessId}`}
                          >
                            {item?.attributes?.Name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        fontSize: "14px !important",
                        padding: "0",
                      }}
                    >
                      {item?.attributes?.businessId}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "45%",
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingRight: "10px",
                          }}
                        >
                          <img
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                            src={
                              item?.attributes?.ManagerImage
                                ? `${urlStrapi}/${item?.attributes?.ManagerImage}`
                                : avatar
                            }
                            alt="null"
                          />
                        </div>
                        <div
                          style={{
                            width: "55%",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          {item?.attributes?.Manager}
                        </div>
                      </div>
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
                          handleModaPresetsShow();
                          setIdBusiness(
                            item?.attributes?.businessId + "&id=" + item?.id
                          );
                        }}
                      >
                        <Badge
                          bg="secondary"
                          style={{ fontSize: "14px", fontWeight: "500" }}
                        >
                          {item?.attributes?.presets?.data?.length}
                        </Badge>
                      </p>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          verticalAlign: "middle",
                          fontSize: "15px",
                          flexDirection: "column",
                        }}
                      >
                        {roleName !== "checkRoleUser" ? (
                          <p
                            className="linkShow"
                            onClick={() => {
                              handleModaAddPeopleShow();
                              setIdBusiness(item?.attributes?.businessId);
                            }}
                            disabled={isButtonAddPeopleDisabled}
                          >
                            {" "}
                            <CgAddR style={{ display: "inline-block" }} /> add
                            people{" "}
                          </p>
                        ) : (
                          ""
                        )}
                        <p
                          className="linkShow"
                          onClick={() => {
                            handleModalSnippetShow(item);
                          }}
                        >
                          {" "}
                          <CgCodeSlash
                            style={{ display: "inline-block" }}
                          />{" "}
                          generate code snippet{" "}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
        {showModalSnippet && (
          <Modal
            show={showModalSnippet}
            onHide={handleModalSnippetClose}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Install Google Tag Manager</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Copy the code below and paste it onto every page of your website
              </p>
              <p>
                Paste this code as high in the <b>&lt;head&gt;</b> of the page
                as possible:
              </p>
              <br />
              <div
                style={{
                  background: "#e9ecef",
                  border: "1px solid #ced4da",
                  padding: "18px",
                  borderRadius: "2px",
                  position: "relative",
                  minHeight: "60px",
                }}
              >
                <span>{codeIntegrationHead}</span>

                <FaRegCopy
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "24px",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                  variant="outline-secondary"
                  id="copy-button"
                  onClick={() => {
                    copyToClipboard(codeIntegrationHead);
                  }}
                />
              </div>
              <br />
              <p>
                Additionally, paste this code immediately after the opening{" "}
                <b>&lt;body&gt;</b> tag:{" "}
              </p>
              <br />
              <div
                style={{
                  background: "#e9ecef",
                  border: "1px solid #ced4da",
                  padding: "18px",
                  borderRadius: "2px",
                  position: "relative",
                  minHeight: "60px",
                }}
              >
                <span>{codeIntegrationBody}</span>

                <FaRegCopy
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "24px",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                  variant="outline-secondary"
                  id="copy-button"
                  onClick={() => {
                    copyToClipboard(codeIntegrationBody);
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalSnippetClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Box>
      {showModalAddPartner && (
        <ModalAddNewPartner
          showModalAddPartner={showModalAddPartner}
          handleModalAddPartnerClose={handleModalAddPartnerClose}
          getJWTToken={getJWTToken}
          setIsButtonAddDisabled={setIsButtonAddDisabled}
          onSubmitSuccess={handleModalSubmitSuccess}
        />
      )}
      {showModalAddPeople && (
        <ModalAddPeople
          showModalAddPeople={showModalAddPeople}
          handleModalAddPeopleClose={handleModalAddPeopleClose}
          getJWTToken={getJWTToken}
          setIsButtonAddPeopleDisabled={setIsButtonAddPeopleDisabled}
          onSubmitSuccess={handleModalAddPeopleSubmitSuccess}
          idBusiness={idBusiness}
          roleName={roleName}
        />
      )}

      <ModalPresets
        showModalPresets={showModalPresets}
        setShowModalPresets={setShowModalPresets}
        handleModalPresetsClose={handleModalPresetsClose}
        getJWTToken={getJWTToken}
        idBusiness={idBusiness}
      />
      {showModalProjectName && (
        <ModalProjectName
          showModalProjectName={showModalProjectName}
          setShowModalProjectName={setShowModalProjectName}
          {...dataAzureCredential}
          getJWTToken={getJWTToken}
        />
      )}
      {showModalAddProjectName && (
        <ModalAddProjectName
          showModalAddProjectName={showModalAddProjectName}
          setShowModalAddProjectName={setShowModalAddProjectName}
          {...dataAzureCredential}
          getJWTToken={getJWTToken}
        />
      )}
    </>
  );
};
export default ListBusiness;
