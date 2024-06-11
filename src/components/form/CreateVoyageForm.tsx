import * as z from "zod";
import { Form, FormDatePicker, FormSelectField, FormTextField } from ".";
import { TFormData } from "../utils/form-helpers";
import { Button } from "../ui/button";
import { SheetFooter } from "../ui/sheet";
import {
  useMutation,
  InvalidateQueryFilters,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import useDfdsApi from "~/client/DfdsApi";
import { useToast } from "../ui/use-toast";
import { VesselsType } from "~/pages/api/vessel/getAll";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

type FormData = TFormData<{
  departure: Date;
  arrival: Date;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: string;
  // unitTypes: string[];
}>;

interface CreateVoyageFormProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const CreateVoyageForm: FunctionComponent<CreateVoyageFormProps> = ({
  setOpen,
}) => {
  const dfdsApi = useDfdsApi();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const vesselQuery = useQuery<VesselsType>({
    queryKey: ["vessels"],
    queryFn: () => dfdsApi.getVessels(),
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: async (voyage: object) => {
      return dfdsApi.createVoyage(voyage);
    },
    onSuccess: async () => {
      toast({ variant: "default", description: `Voyage succesfully created.` });
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
      setOpen && setOpen(false);
    },
    onError: async (error) => {
      toast({ description: error.message, variant: "destructive" });
      setOpen && setOpen(false);
    },
  });

  return (
    <Form<FormData>
      form={{
        defaultValues: {
          departure: new Date(),
          arrival: new Date(),
          portOfLoading: "",
          portOfDischarge: "",
          vessel: "-",
          //   unitTypes: [],
        },
      }}
      schema={z
        .object({
          departure: z.date({ required_error: "required" }),
          arrival: z.date({ required_error: "required" }),
          portOfLoading: z
            .string()
            .min(1, { message: "Port of Loading is required" }),
          portOfDischarge: z
            .string()
            .min(1, { message: "Port of Discharge is required" }),
          vessel: z.string().min(1, { message: "Vessel is required" }),
          // unitTypes: z.array(z.string()),
        })
        .refine(({ arrival, departure }) => arrival > departure, {
          message: "Departure must be before Arrival",
          path: ["arrival"],
        })}
    >
      {({ handleSubmit, formState: { dirtyFields, isSubmitting } }) => {
        const dirtyFieldsToPass =
          dirtyFields.portOfDischarge && dirtyFields.portOfLoading;
        // dirtyFields.vessel;

        return (
          <form
            className="grid gap-4 py-4"
            onSubmit={handleSubmit(async (data) => {
              mutation.mutateAsync(data);
            })}
          >
            <FormDatePicker name="departure" label="Departure" />
            <FormDatePicker name="arrival" label="Arrival" />
            <FormTextField name="portOfLoading" label="Port of Loading" />
            <FormTextField name="portOfDischarge" label="Port of Discharge" />
            <FormSelectField
              name="vessel"
              label="Vessel"
              placeholder="Select a vessel"
              options={vesselQuery.data.map((vessel) => ({
                value: vessel.value,
                label: vessel.label,
              }))}
            />

            <SheetFooter>
              <Button
                type="submit"
                disabled={!dirtyFieldsToPass || isSubmitting}
              >
                Create
              </Button>
            </SheetFooter>
          </form>
        );
      }}
    </Form>
  );
};

export default CreateVoyageForm;
