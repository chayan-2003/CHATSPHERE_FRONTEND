import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const GetStartedButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props} className={`bg-blue-400 hover:bg-blue-700 text-white ${props.className}`}>
      <FontAwesomeIcon icon={faUserPlus} /> Get Started
    </Button>
  );
};

export default GetStartedButton;