export default function ArticleCard({
    article,
    onSelect,
  }: {
    article: any;
    onSelect: () => void;
  }) {
    return (
      <div onClick={onSelect} style={{ border: "1px solid #ccc", padding: 10 }}>
        <h3>{article.title}</h3>
        <p>PMID: {article.pmid}</p>
      </div>
    );
  }
  