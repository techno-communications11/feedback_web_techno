import { motion } from "framer-motion";
import { Form } from "react-bootstrap";
import { FORM_STYLES } from "@/constants/writeup.constants";
import { useFormData } from "./useFormData";
import FormInputs from "./FormInputs";
import PrintPreview from "./PrintPreview";
import { useState, useEffect } from "react";

import { User } from "@/constants/writeup.constants";
import Spinners from "../Spinners";

interface DisciplinaryFormProps {
  selectedUser: User;
  letterheadImgSrc: string;
  companyName?: string;
}

const DisciplinaryForm = ({
  selectedUser,
  letterheadImgSrc,
  companyName,
}: DisciplinaryFormProps) => {
  const { formData, handleChange, isOtherViolationSelected } =
    useFormData(companyName);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // whenever selectedUser changes, show spinner
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500); // adjust delay as needed
    return () => clearTimeout(timer);
  }, [selectedUser]); // dependency: runs whenever selectedUser changes

  if (loading) {
    return <Spinners text="loading..." />;
  }

  return (
    <motion.div
      className="print-container card mt-4"
       style={FORM_STYLES.container as any}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#E10174" }}>
        Notice of Disciplinary Action
      </h2>

      <Form>
        <FormInputs
          formData={formData}
          handleChange={handleChange}
          isOtherViolationSelected={isOtherViolationSelected}
        />
        <PrintPreview
          selectedUser={selectedUser}
          formData={formData}
          letterheadImgSrc={letterheadImgSrc}
        />
      </Form>
    </motion.div>
  );
};

export default DisciplinaryForm;
