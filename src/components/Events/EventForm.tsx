import { ReactNode, useState } from "react";
import ImagePicker from "../ImagePicker";
import { useQuery } from "@tanstack/react-query";

import ErrorBlock from "../UI/ErrorBlock";
import { fetchSelectableImages } from "../../util/http";

export type InputData = {
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

interface EventProps {
  inputData: InputData | null;
  onSubmit: (data: InputData) => void;
  children: ReactNode;
}

export default function EventForm({
  inputData,
  onSubmit,
  children,
}: EventProps) {
  const [selectedImage, setSelectedImage] = useState(inputData?.image || "");

  const { data, isPending, isError } = useQuery({
    queryKey: ["events-images"],
    queryFn: fetchSelectableImages,
  });

  function handleSelectImage(image: string) {
    setSelectedImage(image);
  }

  // const isMutating = useIsMutating({
  //   mutationKey: ['create-event'],
  //   exact: true,
  // });
  // console.log(isMutating);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
    };

    onSubmit({ ...data, image: selectedImage });
  }

  const initialData = inputData || {
    title: "",
    image: "",
    description: "",
    date: "",
    time: "",
    location: "",
  };

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData.title}
        />
      </p>

      {isPending && <p>Loading selectable images...</p>}
      {isError && (
        <ErrorBlock
          title="Failed to load images"
          message="Please try again later"
        />
      )}

      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )}

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData.description}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={initialData.date}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={initialData.time}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={initialData.location}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
