import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ILanguage, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import Select from "@/ui/Select"; // Import your custom Select component
import { v4 as uuidv4 } from "uuid";

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];

const LanguagesForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [languages, setLanguages] = useState<ILanguage[]>(resumeInfo.languages || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    langId: string,
    field: keyof ILanguage,
    value: string
  ) => {
    setLanguages((prev) =>
      prev.map((lang) => (lang.id === langId ? { ...lang, [field]: value } : lang))
    );
    setResumeInfo((prev) => ({
      ...prev,
      languages,
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
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, { languages });

      if (status === 200) {
        toast.success("Languages saved successfully.", {
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

  const handleAddLanguage = () => {
    const newLanguage: ILanguage = {
      id: uuidv4(),
      name: "",
      proficiency: "",
    };
    setLanguages((prev) => [...prev, newLanguage]);
    setResumeInfo((prev) => ({
      ...prev,
      languages: [...languages, newLanguage],
    }));
  };

  const handleRemoveLanguage = (langId: string) => {
    setLanguages((prev) => prev.filter((lang) => lang.id !== langId));
    setResumeInfo((prev) => ({
      ...prev,
      languages: languages.filter((lang) => lang.id !== langId),
    }));
  };

  const handleMoveLanguage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedLanguages = [...languages];
    const movedLanguage = updatedLanguages.splice(index, 1);
    updatedLanguages.splice(newIndex, 0, movedLanguage[0]);
    setLanguages(updatedLanguages);
    setResumeInfo((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Languages Component: ", languages);
  }, [languages]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Languages</h2>

      {languages.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No languages added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {languages.map((lang, index) => (
            <motion.div
              key={lang.id}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Language #{index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveLanguage(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveLanguage(index, "down")}
                    disabled={index === languages.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLanguage(lang.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <input
                  type="text"
                  placeholder="Language Name"
                  value={lang.name}
                  onChange={(e) => handleInputChange(lang.id, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <Select
                  value={lang.proficiency}
                  onChange={(e) => handleInputChange(lang.id, "proficiency", e.target.value)}
                  className="w-full p-2"
                >
                  <option value="" disabled>
                    Select Proficiency
                  </option>
                  {proficiencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </form>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveLanguage(lang.id)}
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
        onClick={handleAddLanguage}
        variant="outline"
        className="mb-4"
      >
        Add Language
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

export default LanguagesForm;
