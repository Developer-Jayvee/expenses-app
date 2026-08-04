import FormControl from "@c/components/FormControl";
import FormSelect from "@c/components/FormSelect";
import { BillsContext } from "@c/context/BillsProvider";
import { StatusOptions } from "@c/data/options";
import { useContext } from "react";

export default function BillForm() {
  const { register, control } = useContext(BillsContext)
  if(!register) return null;
  return (
    <div className="p-4">
      <h3 className="font-bold text-2xl">Bills</h3>
      <div className="mt-4 flex flex-col gap-2">
        <FormControl
          label={{
            name: "Bill Title",
          }}
          input={{
            name: "name",
            placeholder: "e.g Rent",
            type: "text",
            props: {...register?.("name")}
          }}
        />
        <FormControl
          label={{ name: "Amount(Pesos)" }}
          input={{ name: "amount", placeholder: "0.00", type: "number" , props: {...register?.("amount")}}}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <FormControl
            label={{ name: "Billing Date" }}
            input={{
              name: "billing_date",
              placeholder: "Billing Date",
              type: "date",
              props : {...register?.("billing_date")}
            }}
          />
          <FormControl
            label={{ name: "End Date" }}
            input={{
              name: "end_date",
              placeholder: "End Date",
              type: "date",
              props: {...register("end_date",{
                valueAsDate: true
              })}
            }}
          />
        </div>
        <FormSelect
          control={control}
          label={{
            name: "Status",
          }}
          name="status"
          input={{
            placeholder: "Select Status",
            props:{...register?.("status")}
          }}
          options={StatusOptions}
        />
      </div>
    </div>
  );
}
