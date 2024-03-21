import { Box, Flex, Stack } from "@chakra-ui/react";
import { Button } from "antd";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import "./Tooltip.css";

const handleLogout = () => {
  localStorage.removeItem("dtvt");
  window.location.reload();
};
function SidebarContent(props) {
  const { routes } = props;
  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px="16px"
      borderRadius="30px"
      gap="35px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>
      <Box mb="90px" display="flex" justifyContent="center">
        <Button
          type="text"
          danger
          style={{ display: "flex", alignItems: "center", fontSize: "16px", padding: "20px" }}
          onClick={handleLogout}
        >
          <IoIosLogOut style={{ marginRight: "5px" , fontSize: "20px" }} /> Logout
        </Button>
      </Box>
    </Flex>
  );
}

export default SidebarContent;
