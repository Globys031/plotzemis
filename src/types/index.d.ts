// https://dev.to/minompi/add-images-to-a-react-project-with-typescript-4gbm
declare module "*.png" {
  const path: string;
  export default path;
}