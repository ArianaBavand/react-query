import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
import useGetEventsQuery from "../../util/useGetEventsQuery";

export interface EventData {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event?: any;
}

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useGetEventsQuery();

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={
          (error instanceof Error && error.message) || "Failed to fetch events"
        }
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event: EventData) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
