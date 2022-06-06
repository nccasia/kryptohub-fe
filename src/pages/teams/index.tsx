import axiosClient from "@/api/axios-client";
import { useAppSelector } from "@/redux/hooks";
import { getSkillsSelector } from "@/redux/selector";
import { Layout } from "@/src/layouts/layout";
import { ComboboxSelect } from "@/src/layouts/team/ComboboxSelect";
import { TeamCard } from "@/src/layouts/team/TeamCard";
import { TimeZone } from "@/type/enum/TimeZone";
import { Team } from "@/type/team/team.type";
import {
  ArrowDropDown,
  ArrowDropUp,
  CancelOutlined,
  Close,
  JoinFullOutlined,
  JoinInnerOutlined,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Pagination } from "@mui/material";
import { useOutsideClick } from "hook/OuterClick";
import { useRouter } from "next/router";
import { FormEvent, LegacyRef, useEffect, useState } from "react";

const SortBy = ["none", "rating", "size", "working time"];
interface PageResponse {
  content: Team[];
  pagable: {
    total: number;
    page: number;
    size: number;
  };
}
const initFilter = {
  search: "",
  matchAll: false,
  sortBy: 0,
  sortDsc: true,
  skill: [] as string[],
  timezone: [] as string[],
};
export const Teams = () => {
  const router = useRouter();
  const [teams, setTeams] = useState([] as Team[]);
  const SkillSelect = useAppSelector(getSkillsSelector);
  const [filter, setFilter] = useState({
    search: "",
    matchAll: false,
    sortBy: 0,
    sortDsc: true,
    skill: [] as string[],
    timezone: [] as string[],
  });

  const [currentPage, setcurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalTeam, setTotalTeam] = useState(0);
  const { show, setShow, nodeRef, subNodeRef } = useOutsideClick();
  const [isReady, setIsReady] = useState(false);
  useEffect(()=>{
    if(!router.isReady) return;
    
    if(router.query.page && parseInt(router.query.page as string)!== currentPage){
      let page = parseInt(router.query.page as string);
      if(page < 1) page = 1;
      setcurrentPage(page);
    }
    let skillQuery = [] as string[];
    let timezoneQuery = [] as string[];
    let searchQuery = "";
    if (router.query.timezone) {
      if (typeof router.query.timezone === "string") {
        timezoneQuery = [router.query.timezone.replace(' ', '+')];
      } else {
        timezoneQuery = (router.query.timezone as string[]).map((item) => item.replace(' ', '+'));
      };
    }
    if(router.query.skill){
      if(typeof router.query.skill === "string"){
        skillQuery= [router.query.skill];
      }else{
        skillQuery= router.query.skill as string[];
      }
    }
    if(router.query.search){
      searchQuery = router.query.search as string;
    }
    setFilter({
      ...filter,
      skill: skillQuery,
      timezone: timezoneQuery,
      search: searchQuery,
    })
    setIsReady(true);
  },[router.isReady])
  useEffect(() => {
    if (isReady && SkillSelect.length > 0) {
      axiosClient
        .get("/team/list", {
          params: {
            page: currentPage,
            size: 5,
            skill_IN: filter.skill.map(
              (item) =>
                SkillSelect.find((skill) => skill.skillName === item)?.id
            ),
            timeZone_IN: filter.timezone,
            keyword: filter.search,
          },
        })
        .then((response) => {
          const res = response.data as PageResponse;
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          const maxPage = Math.ceil(res.pagable.total / res.pagable.size);
          if (currentPage > maxPage && maxPage > 0) {
            setcurrentPage(maxPage);
          } else if (currentPage < 1) {
            setcurrentPage(1);
          } else {
            setTeams(res.content);
            setTotalPage(maxPage);
            setTotalTeam(res.pagable.total);
          }
        });
      let url = `/teams?page=${currentPage}`;
      if (filter.search.length > 0) {
        url += `&search=${filter.search}`;
      }
      filter.skill.forEach((sk) => {
        url += `&skill=${sk}`;
      });

      filter.timezone.forEach((tz) => {
        url += `&timezone=${tz}`;
      });
      window.history.replaceState({}, "", url);
      setIsReady(true);
    }
  }, [filter, currentPage, SkillSelect]);


  const handleSearch = (event: any) => {
    setFilter({ ...filter, search: event.target.value });
  };

  const handleSkillSelect = (selected: string[]) => {
    setFilter({ ...filter, skill: selected });
  };

  const handleTimezoneSelect = (selected: string[]) => {
    setFilter({ ...filter, timezone: selected });
  };

  const handleSortBySelect = (event: FormEvent<HTMLElement>) => {
    const target = event.target as HTMLInputElement;
    setFilter({ ...filter, sortBy: parseInt(target.value) });
  };

  const handleClearAll = () => {
    setFilter(initFilter);
  };

  const handlePageChange = (value: number) => {
    setcurrentPage(value);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center relative bg-cyan-900 border-t border-cyan-500  ">
        <div className="py-6 flex items-center justify-start text-white  font-semibold w-full md:w-4/5 px-2">
          <div
            className="px-4 py-2 w-fit border-2 border-red-500 xxs:flex hidden items-center justify-center text-xl
           before:bg-cyan-300 before:h-[6px] before:w-[6px] before:rounded before:absolute before:top-[-4px] before:z-50
           after:bg-cyan-700 after:h-4 after:w-[1px] after:absolute after:top-[2px]"
          >
            <span>2022 Kryptohub</span>
          </div>
          <div className="ml-4 text-3xl">
            <h1>List Teams</h1>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex flex-col items-center justify-center px-1 ">
          <div className="container-lg relative border-x-2  xl:w-3/4 md:w-11/12 lg:w-5/6 w-full  shadow-xl">
            <div className="sticky top-0 w-full flex flex-col text-cyan-700 bg-white z-10">
              <div className="flex flex-col sm:flex-row border-b ">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex ">
                    <div className="p-1 xs:p-4 bg-cyan-900 text-white font-semibold border-2 border-cyan-900 mr-2 max-w-[10rem] hidden sm:block">
                      <span>{totalTeam} Teams</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white">
                  <div className="flex flex-col sm:flex-row p-2 items-end sm:items-center  justify-center text-sm md:text-md w-full h-full">
                    <div className="flex flex-row items-center justify-center flex-1 w-full relative">
                      <input
                        type="text"
                        placeholder="Search here..."
                        className="shadow appearance-none border  w-full text-cyan-700 focus:outline-none focus:shadow-outline p-1"
                        name="search"
                        defaultValue={filter.search}
                        onChange={handleSearch}
                        maxLength={30}
                      />
                      <div className="absolute right-1 bg-white flex items-center h-[95%]">
                        <SearchIcon />
                      </div>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                      <div className="xxs:flex hidden">
                        <div
                          className="cursor-pointer flex items-center justify-center mr-2"
                          onClick={() => {
                            setFilter({
                              ...filter,
                              matchAll: !filter.matchAll,
                            });
                          }}
                        >
                          {filter.matchAll ? (
                            <JoinInnerOutlined />
                          ) : (
                            <JoinFullOutlined />
                          )}
                        </div>
                        <div className="cursor-pointer flex items-center justify-center mr-2">
                          <ComboboxSelect
                            label="Skills"
                            items={SkillSelect.map((sk) => sk.skillName)}
                            selected={filter.skill}
                            setSelected={handleSkillSelect}
                          />
                        </div>
                        <div className="cursor-pointer flex items-center justify-center mr-2">
                          <ComboboxSelect
                            label="Timezones"
                            items={Object.values(TimeZone)}
                            selected={filter.timezone}
                            setSelected={handleTimezoneSelect}
                          />
                        </div>
                      </div>
                      <div className="cursor-pointer flex items-center justify-center mr-2">
                        <div
                          className={`border-2 flex items-center justify-between w-full px-1 py-[0.125rem] `}
                          onClick={() => {
                            setShow(!show);
                          }}
                          ref={nodeRef as LegacyRef<HTMLDivElement>}
                        >
                          <label className={`pointer-events-none min-w-[50px]`}>
                            All filter
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-center border-l pl-2">
                        <select
                          name="sort"
                          id=""
                          value={filter.sortBy === 0 ? " " : filter.sortBy}
                          className="bg-transparent border-2 "
                          onChange={handleSortBySelect}
                        >
                          <option hidden value="">
                            Sort by
                          </option>
                          {SortBy.map((key, index) => (
                            <option key={index} value={index}>
                              {key}
                            </option>
                          ))}
                        </select>
                        <div
                          className=""
                          onClick={() => {
                            setFilter({ ...filter, sortDsc: !filter.sortDsc });
                          }}
                        >
                          {filter.sortDsc ? <ArrowDropDown /> : <ArrowDropUp />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {filter.skill.length || filter.timezone.length > 0 ? (
                <div className="p-2 border-b">
                  {filter.skill.map((skill, index) => {
                    return (
                      <div
                        key={index}
                        className="p-1 inline-block border rounded-lg mr-2 w-fit text-sm hover:bg-cyan-50 cursor-pointer"
                        onClick={() => {
                          setFilter({
                            ...filter,
                            skill: filter.skill.filter((i) => i !== skill),
                          });
                        }}
                      >
                        <span className="text-gray-400">Skills:</span>
                        <span>{skill}</span>
                        <Close className="text-sm cursor-pointer" />
                      </div>
                    );
                  })}
                  {filter.timezone &&
                    filter.timezone.map((tz, index) => {
                      return (
                        <div
                          key={index}
                          className="p-1 inline-block border rounded-lg mr-2 w-fit text-sm hover:bg-cyan-50 cursor-pointer"
                          onClick={() => {
                            setFilter({
                              ...filter,
                              timezone: filter.timezone.filter((i) => i !== tz),
                            });
                          }}
                        >
                          <span className="text-gray-400">Timezones:</span>
                          <span>{tz}</span>
                          <Close className="text-sm cursor-pointer" />
                        </div>
                      );
                    })}
                  <div
                    className="p-1 inline-block border rounded-lg mr-2 w-fit text-sm hover:bg-cyan-50 cursor-pointer"
                    onClick={handleClearAll}
                  >
                    <span>Clear All</span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              {teams.map((item, index) => (
                <TeamCard team={item as Team} key={index} />
              ))}
            </div>
            <div className="flex items-center justify-center pb-2">
              <Pagination
                count={totalPage}
                page={currentPage}
                onChange={(e, value) => {
                  handlePageChange(value);
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={`fixed right-0 top-0 bg-white overflow-y-scroll h-full custom-scrollbar z-50 p-2 min-w-[300px] w-full xs:w-fit shadow-xl text-cyan-900 animate-slide-in-left ${
            show ? "" : "hidden"
          }`}
          ref={subNodeRef as LegacyRef<HTMLDivElement>}
        >
          <div className="flex items-center justify-center relative p-2">
            <div
              className="absolute left-2 cursor-pointer"
              onClick={() => {
                setShow(false);
              }}
            >
              <CancelOutlined />
            </div>
            <span className="text-xl">All filter</span>
          </div>

          <div className="flex flex-col items-end">
            <div
              className="cursor-pointer flex items-center justify-center mr-2"
              onClick={() => {
                setFilter({ ...filter, matchAll: !filter.matchAll });
              }}
            >
              {filter.matchAll ? <JoinFullOutlined /> : <JoinInnerOutlined />}
            </div>
            <div className="flex flex-row items-center justify-center flex-1 w-full relative">
              <input
                type="text"
                placeholder="Search here..."
                className="shadow appearance-none border  w-full text-cyan-700 focus:outline-none focus:shadow-outline p-1"
                name="search"
                onChange={handleSearch}
                defaultValue={filter.search}
                maxLength={30}
              />
              <div className="absolute right-1 bg-white flex items-center h-[95%]">
                <SearchIcon />
              </div>
            </div>
            <div className="w-full">
              <ComboboxSelect
                label={"Skills"}
                items={SkillSelect.map((sk) => sk.skillName)}
                selected={filter.skill}
                setSelected={handleSkillSelect}
                isCollapsor={true}
                className="py-2 w-full border-b"
              />
              <ComboboxSelect
                label={"Timezones"}
                items={Object.values(TimeZone)}
                selected={filter.timezone}
                setSelected={handleTimezoneSelect}
                isCollapsor={true}
                className="py-2 w-full border-b"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
