import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ICertification, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";

const CertificationForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [certifications, setCertifications] = useState<ICertification[]>(
    resumeInfo.certifications || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    certId: string,
    field: keyof ICertification,
    value: string
  ) => {
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === certId ? { ...cert, [field]: value } : cert
      )
    );
    setResumeInfo((prev) => ({
      ...prev,
      certifications,
    }));
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    if (!params?.id) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, {
        certifications,
      });

      if (status === 200) {
        toast.success("Certifications saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      if (err.response?.data.error.details) {
        err.response.data.error.details.errors.forEach((e) => {
          toast.error(e.message, {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        });
      } else {
        toast.error(err.response?.data.error.message, {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertification = () => {
    const newCertification: ICertification = {
      id: uuidv4(),
      title: "",
      issuer: "",
      date: "",
    };
    setCertifications((prev) => [...prev, newCertification]);
    setResumeInfo((prev) => ({
      ...prev,
      certifications: [...certifications, newCertification],
    }));
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== certId));
    setResumeInfo((prev) => ({
      ...prev,
      certifications: certifications.filter((cert) => cert.id !== certId),
    }));
  };

  const handleMoveCertification = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedCertifications = [...certifications];
    const movedCertification = updatedCertifications.splice(index, 1);
    updatedCertifications.splice(newIndex, 0, movedCertification[0]);
    setCertifications(updatedCertifications);
    setResumeInfo((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Certification Component: ", certifications);
  }, [certifications]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Certifications</h2>

      {certifications.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No certifications added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">
                  Certification #{index + 1}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveCertification(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveCertification(index, "down")}
                    disabled={index === certifications.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveCertification(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <input
                  type="text"
                  placeholder="Certification Title"
                  value={cert.title}
                  onChange={(e) =>
                    handleInputChange(cert.id, "title", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={cert.issuer}
                  onChange={(e) =>
                    handleInputChange(cert.id, "issuer", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={cert.date}
                  onChange={(e) =>
                    handleInputChange(cert.id, "date", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </form>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"danger"}
                  size="sm"
                  onClick={() => handleRemoveCertification(cert.id)}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <Button
        type="button"
        onClick={handleAddCertification}
        variant="outline"
        className="mb-4"
      >
        Add Certification
      </Button>

      <Button
        type="submit"
        variant="success"
        isLoading={isLoading}
        onClick={handleOnSubmit}
      >
        Save
      </Button>
    </div>
  );
};

export default CertificationForm;