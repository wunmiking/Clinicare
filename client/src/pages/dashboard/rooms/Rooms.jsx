import { getAllRooms } from "@/api/rooms";
import ErrorAlert from "@/components/ErrorAlert";
import { SkeletonTable } from "@/components/LazyLoader";
import PageWrapper from "@/components/PageWrapper";
import Paginate from "@/components/Paginate";
import Search from "@/components/Search";
import Table from "@/features/rooms/Table";
import AddRoom from "@/features/rooms/AddRoom";
import Filter from "@/features/rooms/Filter";
import usePaginate from "@/hooks/usePaginate";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { useSearchParams } from "react-router";

export default function Rooms() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getAllRooms", page, limit, query, roomType, roomStatus],
    queryFn: () => getAllRooms(searchParams, accessToken),
  });
  
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

   const rooms = data?.data?.data?.rooms || [];

  return (
    <PageWrapper>
      <div className="flex justify-between items-center pb-2">
        <div className="">
          <h1 className="font-bold text-2xl">Rooms</h1>
          <p className="text-gray-500 text-[14px] md:text-[16px]">
            Manage your rooms booking here.
          </p>
        </div>
        <AddRoom />
      </div>
      <div className="flex justify-end items-center">
        <Search id="search-rooms">
          <Filter />
        </Search>
      </div>
      <div className="flex items-center md:justify-end mt-5"></div>
      {isPending ? (
        <SkeletonTable />
      ) : (
        <>
          {isError ? (
            <ErrorAlert error={error?.response?.data?.message} />
          ) : (
            <>
              {rooms?.length > 0 ? (
                <>
                  <Suspense fallback={<SkeletonTable />}>
                    <Table rooms={rooms} />
                  </Suspense>

                  <Paginate
                    totalPages={totalPages}
                    hasMore={hasMore}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <p className="mt-6 font-semibold text-center">
                  {" "}
                  No room found{" "}
                </p>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}
