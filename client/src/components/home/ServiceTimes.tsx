import { useQuery } from "@tanstack/react-query";

const ServiceTimes = () => {
  const { data: siteContent, isLoading } = useQuery({
    queryKey: ['/api/site-contents/services/times'],
  });

  // Parse content if available, otherwise use defaults
  const content = siteContent
    ? JSON.parse(siteContent.content)
    : {
        sunday: "9:00 AM & 11:00 AM",
        youth: "Fridays at 6:30 PM",
        bibleStudy: "Wednesdays at 7:00 PM"
      };

  return (
    <section className="bg-purple-700 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Sunday Services</h2>
            <p>{content.sunday}</p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Youth Service</h2>
            <p>{content.youth}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Bible Study</h2>
            <p>{content.bibleStudy}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTimes;
