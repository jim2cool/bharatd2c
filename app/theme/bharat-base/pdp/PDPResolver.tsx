import PDPBasic from "./PDPBasic";

export default function PDPResolver({ product }) {
  const template = product?.pdp_template || "bharat-basic";

  switch (template) {
    case "bharat-basic":
    default:
      return <PDPBasic product={product} />;
  }
}

