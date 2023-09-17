import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/docs/installation");  
  }, [navigate]);

  return (
    <div>
    </div>
  )
}