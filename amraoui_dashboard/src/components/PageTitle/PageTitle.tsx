interface IPageTitle {
  heading: string;
  description: string;
}

const PageTitle = ({ heading, description }: IPageTitle) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold">{heading}</h1>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default PageTitle;
