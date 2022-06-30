import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { joinTeam, resetSuccess } from "@/redux/memberSlice";
import { getUserInfoSelector } from "@/redux/selector";
import { RootState } from "@/redux/store";
import DashboardLayout from "@/src/layouts/dashboard/Dashboard";
import { Container, createTheme, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "2px solid #cae0e7",
          "&.Mui-focused": {
            borderColor: "#17313b",
            boxShadow:
              "inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%)",
          },
        },
        notchedOutline: {
          border: "none",
        },
      },
    },
  },
});

const JoinTeamID = () => {
  const router = useRouter();
  const { teamId } = router.query;
  console.log({ router });
  const dispatch = useAppDispatch();
  const actionSuccess = useSelector(
    (state: RootState) => state.MemberReducer.success
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      if (router.isReady) {
        router.push({
          pathname: "/login",
          query: { url: router.asPath },
        });
      }
    }
    if (accessToken) {
      dispatch(joinTeam(parseInt(teamId as string)));
    }
  }, [dispatch, router.isReady, teamId]);

  useEffect(() => {
    if (actionSuccess) {
      dispatch(resetSuccess());
      router.push(`/team/${teamId}`);
    }
  }, [actionSuccess, dispatch, router, teamId]);

  return (
    <DashboardLayout>
      <ThemeProvider theme={theme}>
        <Container>
          <h1>Joining team...</h1>
        </Container>
      </ThemeProvider>
    </DashboardLayout>
  );
};

export default JoinTeamID;
