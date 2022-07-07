import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SkillDis } from "@/src/layouts/create-team/Skill-Dis";
import DashboardLayout from "@/src/layouts/dashboard/Dashboard";
import { Team } from "@/type/team/team.type";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { teamApi } from "@/api/team-api";
import { ICreateTeam } from "@/type/createTeam/createTeam.type";
const SkillDistribution = () => {
  const router = useRouter();

  const [team, setTeam] = useState<Team>({} as Team);
  const [teamId, setTeamId] = useState(router.query.teamId as string);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.query.teamId) {
      setTeamId(router.query.teamId as string);
      teamApi.getTeam(parseInt(router.query.teamId as string)).then((resp) => {
        if (resp.data) {
          setTeam(resp.data);
        }
      });
    }
  }, [router.query]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-8 lg:px-20 bg-thirdary md:px-6 px-2">
        <div className="bg-white w-full p-8">
          <SkillDis
            step={0}
            setStep={function (step: number): void {
              throw new Error("Function not implemented.");
            }}
            title={"Update"}
            skillDistribution={team.skillDistribution}
            teamUpdate={team as unknown as ICreateTeam}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillDistribution;
