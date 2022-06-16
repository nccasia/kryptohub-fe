import { IAwardDetail } from "@/type/awards/awards.type";
import { toast } from "react-toastify";
import axiosClient from "./axios-client";

export const awardsApi = {
  async createAward(award: IAwardDetail, handleRedirect: Function) {
    try {
      const res = await axiosClient.post(`/awards/create`, award);
      handleRedirect(res.data.id, res.data.teamId);
      toast.success("Create Award Success!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  },
  async editAward(award: IAwardDetail, handleGetAwards: Function) {
    try {
      const res = await axiosClient.put(`/awards/update/${award.id}`, award);
      // handleGetAwards(res.data.teamId);
      handleGetAwards(1);
      toast.success("Edit Award Success!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  },
  async deleteAward(award: IAwardDetail, handleRedirect: Function) {
    try {
      const res = await axiosClient.delete(`/awards/delete/${award.id}`);
      handleRedirect(res.data.teamId || 1);
      toast.success(res.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  },
};
