import Button from "@/ui/Button";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { useState } from "react";
import PersonalDataFrom from "./forms/PersonalDataFrom";
import SummaryForm from "./forms/SummaryForm";

const FormSection = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [activeFromIdx, setActiveFromIdx] = useState(2);
  const [enableNextBtn, setEnableNextBtn] = useState(false);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleEnableNextBtn = () => setEnableNextBtn(true);

  const handleDisableNextBtn = () => setEnableNextBtn(false);

  //! handle next button with plus 1 until the last form
  const handleNext = () => {
    if (activeFromIdx < 6) {
      setActiveFromIdx((prev) => prev + 1);
      handleEnableNextBtn();
    } else {
      handleDisableNextBtn();
    }
  };

  //! handle previous button with minus 1 until the first form
  const handlePrev = () => {
    if (activeFromIdx > 1) {
      setActiveFromIdx((prev) => prev - 1);
      handleEnableNextBtn();
    } else {
      handleDisableNextBtn();
    }
  };
  return (
    <div>
      {/*~~~~~~~~$ Form Buttons $~~~~~~~~*/}
      <div className="flex items-center justify-between">
        <Button variant={"outline"} onClick={handlePrev}>
          <LayoutGrid />
        </Button>

        <div className="flex items-center space-x-2">
          {activeFromIdx > 1 && (
            <Button
              className="text-white capitalize tracking-wider text-lg"
              onClick={handlePrev}
            >
              <ArrowLeft />
              prev
            </Button>
          )}
          <Button
            className="text-white capitalize tracking-wider text-lg"
            onClick={handleNext}
            disabled={!enableNextBtn}
          >
            next <ArrowRight />
          </Button>
        </div>
      </div>

      {/*~~~~~~~~$ Personal Data Form $~~~~~~~~*/}
      {activeFromIdx === 1 && (
        <PersonalDataFrom
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Summery Form$~~~~~~~~*/}
      {activeFromIdx === 2 && (
        <SummaryForm
          enableNextBtn={enableNextBtn}
          handleEnableNextBtn={handleEnableNextBtn}
          handleDisableNextBtn={handleDisableNextBtn}
        />
      )}

      {/*~~~~~~~~$ Professional Experience Form $~~~~~~~~*/}
      {activeFromIdx === 3 && <div>Professional Experience</div>}

      {/*~~~~~~~~$ Education Form $~~~~~~~~*/}
      {activeFromIdx === 4 && <div>Education</div>}

      {/*~~~~~~~~$ Skills Form $~~~~~~~~*/}
      {activeFromIdx === 5 && <div>Skills</div>}

      {/*~~~~~~~~$ Language Form $~~~~~~~~*/}
      {activeFromIdx === 6 && <div>Language</div>}
    </div>
  );
};

export default FormSection;
