import { useRef, useState } from "react";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
import { EventData } from "./NewEventsSection";
import useGetEventsQuery from "../../util/useGetEventsQuery";

export default function FindEventSection() {
  const searchElement = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useGetEventsQuery(
    searchTerm,
    searchTerm.trim().length > 0
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchElement.current?.value || "");
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>

      {content}
    </section>
  );
}
