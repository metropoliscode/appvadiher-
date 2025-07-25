import { useState } from "react";

export default function Modal({isOpen, closeModel, children}) {
    const [formData, setFormData] = useState({});
