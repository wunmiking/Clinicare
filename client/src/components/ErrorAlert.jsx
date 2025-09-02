import { RiErrorWarningLine } from "@remixicon/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ErrorAlert({ error }) {
  const navigate = useNavigate();
  useEffect(() => {
    if(error === "jwt expired") {
      navigate(0); //the index zero reloads the same page. 1 reloads the next page and -1 reloads the previous page
    }
  }, [error, navigate]);
  return (
    <>
    {/* if the error is not "jwt expired", show the alert below */}
    {error !== "jwt expired" && (
      <div role="alert" className="alert bg-red-400 text-white">
        <RiErrorWarningLine className="text-white" />
        <span className="text-sm">Error! {error}</span>
      </div>
      )}
    </>
  );
}
