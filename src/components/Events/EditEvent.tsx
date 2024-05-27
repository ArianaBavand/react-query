import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../UI/Modal";
import EventForm, { InputData } from "./EventForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";

export default function EditEvent() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationKey: ["update-event", params.id],
    mutationFn: updateEvent,
    onMutate: async ({ eventData }) => {
      const newEvent = eventData.event;
      await queryClient.cancelQueries({ queryKey: ["events", params.id] });
      const previousEvent = queryClient.getQueryData(["events", params.id]);

      queryClient.setQueryData(["events", params.id], newEvent);

      return { previousEvent };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["events", params.id], context?.previousEvent);
      console.log("Error occurred:", error);
    },
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(["events", params.id], updatedEvent);
      queryClient.invalidateQueries({ queryKey: ["events", params.id] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", params.id],
      });
    },
  });

  function handleSubmit(eventData: InputData) {
    mutate({
      id: params.id,
      eventData: {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        date: eventData.date,
        image: eventData.image,
        time: eventData.time,
      },
    });
    console.log(eventData);
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.message ||
            "Failed to load event, please check your input and try again later"
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Ok
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
