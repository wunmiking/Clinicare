import { getAllPatients } from '@/api/patients'
import ErrorAlert from '@/components/ErrorAlert'
import { SkeletonCard } from '@/components/LazyLoader'
import PageWrapper from '@/components/PageWrapper'
import Paginate from '@/components/Paginate'
import Search from '@/components/Search'
// import AddNewPatient from '@/features/patients/AddNewPatient'
import Filter from '@/features/patients/Filter'
import UsersCard from '@/features/users/UsersCard'
import usePaginate from '@/hooks/usePaginate'
import { useAuth } from '@/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSearchParams } from 'react-router'


export default function Patients() {

const [searchParams] = useSearchParams();
const {accessToken} = useAuth();
const page = Number (searchParams.get("page")) || 1;
const limit = Number (searchParams.get("limit")) || 10;
const gender = searchParams.get("gender") || "";
const bloodGroup = searchParams.get("bloodGroup") || "";
const query = searchParams.get("query") || "";
const {isPending, isError, data, error} = useQuery({
  queryKey: ["getAllPatients", page, limit, gender, bloodGroup, query],
  queryFn: () => getAllPatients(searchParams, accessToken),
});

console.log(data);

const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });

const users = data?.data?.data?.users || [];
const patients = users.filter((user) => user.role === "patient");

   return (
    <PageWrapper>
      <div className="flex justify-between items-center pb-2">
        <div className="">
          <h1 className="font-bold text-2xl">Patients</h1>
          <p className="text-gray-500 text-[14px] md:text-[16px]">
            Manage your patients.
          </p>
        </div>
        {/* <AddNewPatient /> */}
      </div>
      <div className="flex justify-end items-center">
          <Search id="search-patients">
            <Filter />
          </Search>
        </div>
      <div className="flex items-center md:justify-end mt-5">

      </div>
      {isPending && <SkeletonCard/>}
{isError && <ErrorAlert error={error?.response?.data?.message} />}
      {patients?.length > 0 ? (
        <>
          {/* <div className="mt-5 grid gap-3 grid-cols-12">
            {patients.map((item) => (
              <div
                key={item.id}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <UsersCard item={item} />
              </div>
            ))}
          </div> */}
          <Paginate
            totalPages={totalPages}
            hasMore={hasMore}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </>
      ) : (
        <p className="mt-6 font-semibold text-center"> No patient found </p>
      )}
    </PageWrapper>
  );

}
