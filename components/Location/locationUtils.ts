import {TodayTixLocation} from "../../types/shows";

export const formatLocationName = (name: keyof typeof TodayTixLocation) => {
  switch (name) {
    case "WashingtonDC":
      return "Washington D.C.";
    default:
      // Add a space between the capital letters of the word
      return name.replace(/([A-Z])/g, " $1").trim();
  }
};
