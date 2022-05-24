import { Layout } from "@/src/layouts/layout";
import { DeleteTeam, GetAllTeam } from "redux/teamSlice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeam, setTeam } from "../../../redux/createTeam";
import { ICreateTeam } from "@/type/createTeam/createTeam.type";

const ManageTeam = () => {
  const dispatch = useDispatch();
  const team = useSelector((state: any) => state.createTeam.value);
  const [data, setData] = useState([]);
  useEffect(() => {
    GetAllTeam().then((resp) => {
      dispatch(setTeam(resp));
    });
  }, [dispatch]);

  useEffect(() => {
    setData(team);
  }, [data, team]);

  const handleDelete = (teams: ICreateTeam) => {
    /*   DeleteTeam(teams.id); */
    dispatch(setTeam(teams));
    console.log(teams);
  };
  return (
    <Layout>
      <div className="px-4 mb-5 mt-5 w-full justify-between flex items-center">
        <h1 className="text-xl font-bold">KryptoHub {">"} Manage Teams</h1>
        <div>
          <Link href="/manage-teams/create-new-team">
            <a className="px-6 py-2 text-white rounded bg-red-600 mt-5">
              New team
            </a>
          </Link>
        </div>
      </div>
      <div className="px-4">
        {data != [] &&
          data.map((resp: any) => {
            return (
              <div
                className="flex items-center justify-between mb-5"
                key={resp.id}
              >
                <div>
                  <span>Team name: {resp.teamName}</span>
                  <span>Team Size: {resp.teamSize}</span>
                  <span>Skills: {resp.skill}</span>
                </div>
                <div>
                  <button className="px-6 py-2 text-white rounded bg-yellow-600 mt-5 mr-3">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resp)}
                    className="px-6 py-2 text-white rounded bg-cyan-600 mt-5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </Layout>
  );
};

export default ManageTeam;
