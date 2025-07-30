import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        );
        break;

        case "select":
          element = (
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}
            >
              {/* Select Trigger (Ensures White Background & Darker Text) */}
              <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
        
              {/* Select Content (Ensures Dropdown is Opaque & Fully Visible) */}
              <SelectContent className="bg-white text-gray-900 shadow-lg border border-gray-300 rounded-md">
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem
                        key={optionItem.id}
                        value={optionItem.id}
                        className="hover:bg-gray-100 text-gray-900"
                      >
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          );
          break;
        

          case "textarea":
            element = (
              <Textarea
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.id}
                value={value}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            );
            break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            className="text-gray-400 placeholder-gray-400 border-none focus:ring-0"
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
