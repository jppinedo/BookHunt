import React from "react";
import { Card } from "@jppinedo/lienzo";
import FileNotFound from "@assets/images/FileNotFound";

/** NoResults — was MUI Paper + Typography. Now a Lienzo Card + plain text. */
const NoResults = () => (
  <Card
    padded={false}
    className="flex items-center gap-4 px-8 py-4 w-fit mx-auto"
  >
    <FileNotFound color="orange" size={35} />
    <p className="m-0">No results found</p>
  </Card>
);

export default NoResults;
