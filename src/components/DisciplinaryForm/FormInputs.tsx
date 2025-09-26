import { Form } from "react-bootstrap";
import { WARNING_TYPES, VIOLATIONS, FORM_STYLES } from "@/constants/writeup.constants";

interface FormInputsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isOtherViolationSelected: boolean;
}

const FormInputs = ({ formData, handleChange, isOtherViolationSelected }: FormInputsProps) => (
  <>
    {/* Employee Info */}
    <div className="row mb-2">
      <Form.Group className="col-md-6">
        <Form.Label>EMPLOYEE NAME:</Form.Label>
        <Form.Control
          type="text"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          style={FORM_STYLES.input}
        />
      </Form.Group>
      <Form.Group className="col-md-6">
        <Form.Label>DATE:</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={FORM_STYLES.input}
        />
      </Form.Group>
    </div>

    {/* Supervisor & Location */}
    <div className="row mb-2">
      <Form.Group className="col-md-6">
        <Form.Label>SUPERVISOR NAME:</Form.Label>
        <Form.Control
          type="text"
          name="supervisorName"
          value={formData.supervisorName}
          onChange={handleChange}
          style={FORM_STYLES.input}
        />
      </Form.Group>
      <Form.Group className="col-md-6">
        <Form.Label>LOCATION:</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          style={FORM_STYLES.input}
        />
      </Form.Group>
    </div>

    {/* Warning Types */}
    <Form.Group className="mb-2">
      <div className="row">
        {WARNING_TYPES.map((type) => (
          <Form.Check
            key={type}
            className="col-md-4"
            type="checkbox"
            label={type}
            name="warningType"
            value={type}
            checked={formData.warningType.includes(type)}
            onChange={handleChange}
          />
        ))}
      </div>
    </Form.Group>

    {/* Violations */}
    <Form.Group className="mb-2">
      <Form.Label>Nature of Violation</Form.Label>
      <div className="row" style={{ maxHeight: "60mm", overflowY: "auto" }}>
        {VIOLATIONS.map((violation) => (
          <div key={violation} className="col-md-6 mb-1">
            <Form.Check
              type="checkbox"
              label={violation}
              name="violation"
              value={violation}
              checked={formData.violation.includes(violation)}
              onChange={handleChange}
            />
            {violation === "Others (If Any):" && isOtherViolationSelected && (
              <Form.Control
                type="text"
                name="otherViolationText"
                value={formData.otherViolationText}
                onChange={handleChange}
                placeholder="Specify other violation"
              />
            )}
          </div>
        ))}
      </div>
    </Form.Group>

    {/* Company Statement */}
    <Form.Group className="mb-2">
      <Form.Label>COMPANY STATEMENT</Form.Label>
      <Form.Control
        as="textarea"
        rows={2}
        name="companyStatement"
        value={formData.companyStatement}
        onChange={handleChange}
        style={FORM_STYLES.textarea}
      />
    </Form.Group>

    {/* Disagree */}
    <Form.Group className="mb-2">
      <Form.Label>I DISAGREE with company’s description:</Form.Label>
      <Form.Control
        type="text"
        name="disagree"
        value={formData.disagree}
        onChange={handleChange}
        style={FORM_STYLES.input}
      />
    </Form.Group>
  </>
);

export default FormInputs;
