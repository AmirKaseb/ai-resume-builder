import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../components/FormSection";
import ResumePreview from "../components/ResumePreview";
import { IResumeInfo } from "@/interfaces";
import GlobalApi from "@/service/GlobalApi";

const EditResume = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const params = useParams<{ resumeId: string }>();
  const [resumeInfo, setResumeInfo] = useState<IResumeInfo>();

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    getResumeData();
  }, []);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const getResumeData = () => {
    GlobalApi.GetResumeById(params.resumeId!).then((resp) => {
      
      setResumeInfo(resp.data.data);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
      <ResumeInfoContext.Provider value={{ resumeInfo: resumeInfo || {} as IResumeInfo, setResumeInfo }}>
        <FormSection />
        <ResumePreview />
      </ResumeInfoContext.Provider>
    </div>
  );
};

export default EditResume;
