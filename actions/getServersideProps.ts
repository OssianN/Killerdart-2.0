'use server';

export async function getServerSideProps() {
  const handRecognitionKey = process.env.HAND_RECOGNITION_API_KEY;

  return {
    props: { handRecognitionKey },
  };
}
