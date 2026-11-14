"use client";

import { useModal }
from "../../Context/ModalContext";

const ModalRenderer = () =>
{
    const { content } = useModal();

    return content;
};

export default ModalRenderer;