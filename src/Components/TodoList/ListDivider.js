import "./ListDivider.css";

function ListDivider({ dividerText }) {
  return (
    <div className="listDivider">
      <h3 className="dividerText">{dividerText}</h3>
      <span className="dividerLine"></span>
    </div>
  )
}

export { ListDivider };