import { QueryClient } from "@tanstack/react-query";
import { EventData } from "../components/Events/NewEventsSection";

export const queryClient = new QueryClient();

interface ErrorResponse {
  code: number;
  info: string;
}

export async function fetchEvents({
  signal,
  searchTerm,
  max,
}: {
  signal?: AbortSignal;
  searchTerm?: string;
  max?: number;
}) {
  let url = "http://localhost:3000/events";

  if (searchTerm && max) {
    url += "?search=" + searchTerm + "&max=" + max;
  } else if (searchTerm) {
    url += "?search=" + searchTerm;
  } else if (max) {
    url += "?max=" + max;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  const { events } = await response.json();
  return events;
}

export async function createNewEvent(eventData: Omit<EventData, "id">) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify({ event: eventData }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  const { events } = await response.json();
  return events;
}

export async function fetchSelectableImages({
  signal,
}: {
  signal?: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
  });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEvent({
  id,
  signal,
}: {
  id?: string;
  signal?: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    signal,
  });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent({ id }: { id?: string }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  return response.json();
}

export async function updateEvent({
  id,
  eventData,
}: {
  id?: string;
  eventData: Omit<EventData, "id">;
}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id: id, event: eventData }), // No need to nest eventData under 'event'
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorResponse: ErrorResponse = {
      code: response.status,
      info: await response.json(),
    };

    throw errorResponse;
  }

  return response.json();
}
