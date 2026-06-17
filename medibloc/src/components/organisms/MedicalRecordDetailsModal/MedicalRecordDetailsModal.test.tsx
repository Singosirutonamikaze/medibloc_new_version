// @vitest-environment jsdom
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MedicalRecordDetailsModal } from "./MedicalRecordDetailsModal";
import type { MedicalRecord } from "../../../types";

const mockRecord: MedicalRecord = {
  id: 1,
  patientId: 2,
  title: "Consultation Générale",
  content: "Observations cliniques de test.",
  files: ["/uploads/file1.pdf", "https://example.com/file2.jpg"],
  createdAt: "2026-06-17T10:00:00.000Z",
  patient: {
    id: 2,
    userId: 2,
    birthDate: "1990-01-01T00:00:00.000Z",
    gender: "MALE",
    phone: "0102030405",
    address: "123 Rue de Test, Paris",
    user: {
      id: 2,
      email: "patient@test.com",
      firstName: "Jean",
      lastName: "Dupont",
      role: "PATIENT",
      createdAt: "2026-06-17T10:00:00.000Z",
      updatedAt: "2026-06-17T10:00:00.000Z"
    }
  }
};

describe("MedicalRecordDetailsModal", () => {
  test("renders medical record details correctly", () => {
    const onClose = vi.fn();
    render(<MedicalRecordDetailsModal record={mockRecord} onClose={onClose} />);

    expect(screen.getByText("Consultation Générale")).toBeDefined();
    expect(screen.getByText("Observations cliniques de test.")).toBeDefined();
    expect(screen.getByText("Jean Dupont")).toBeDefined();
    expect(screen.getByText("Genre: Masculin")).toBeDefined();
    expect(screen.getByText("0102030405")).toBeDefined();
    expect(screen.getByText("123 Rue de Test, Paris")).toBeDefined();
    expect(screen.getByText("Document #1")).toBeDefined();
    expect(screen.getByText("Document #2")).toBeDefined();
  });

  test("calls onClose when close button or backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<MedicalRecordDetailsModal record={mockRecord} onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: "Fermer" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByRole("button", { name: "Fermer le modal" });
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
