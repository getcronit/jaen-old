import { connectPopup, Field } from "@snek-at/jaen"

const Popup = connectPopup(
  () => (
    <div>
      <Field.Text name="name" displayName="Name" defaultValue="foooo" />
    </div>
  ),
  {
    displayName: "Popup 1",
    description: "Popup 1 description",
    imageURL:
      "https://hr.mcmaster.ca/app/uploads/2020/05/out-of-office-vacation-720x405.jpg",
    conditions: {
      entireSite: true,
    },
    triggers: {
      onPageLoad: 1,
    },
  }
)

export default Popup
