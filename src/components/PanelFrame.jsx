function PanelFrame({ title, onHide, children }) {
  return (
    <section className="panel-frame">
      <header className="panel-handle">
        <h2>{title}</h2>
        <button
          type="button"
          className="panel-close"
          aria-label={`Hide ${title} panel`}
          onClick={onHide}
        >
          &times;
        </button>
      </header>
      <div className="panel-body">{children}</div>
    </section>
  )
}

export default PanelFrame
