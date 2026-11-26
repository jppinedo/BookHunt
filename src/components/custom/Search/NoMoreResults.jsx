import React from "react";
import { Card } from "@jppinedo/lienzo";

/** NoMoreResults — was MUI Paper + Typography. Now a Lienzo Card + plain text. */
const NoMoreResults = () => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Card padded={false} className="w-fit mx-auto">
      <p className="m-0 px-16 py-4 text-sm">No more results found.</p>
    </Card>
  </div>
);

export default NoMoreResults;
