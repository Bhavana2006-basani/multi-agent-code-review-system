function CodeEditor({ code, setCode }) {

  return (

    <textarea
      className="code-editor"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Paste your source code here..."
    />

  );

}

export default CodeEditor;