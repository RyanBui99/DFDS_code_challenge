import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchData } from "~/utils";
import type { ReturnType } from "./api/voyage/getAll";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import Sheet from "~/components/atoms/Sheet";
import { CreateVoyageForm } from "~/components/form";
import { useState } from "react";
import { Popover } from "~/components/atoms";
import { useToast } from "~/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const { data: voyages } = useQuery<ReturnType>({
    queryKey: ["voyages"],

    queryFn: () => fetchData("voyage/getAll"),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            toast({
              variant: "destructive",
              title: "Error: Could not delete voyage.",
              description: `A problem occured while attempting to delete voyage (id: ${voyageId}).`,
            });
            throw new Error(
              "Failed to delete the voyage due to a random error.",
            );
          case 404:
            toast({
              variant: "destructive",
              title: "Error: Could not delete voyage.",
              description: `The voyage with the specified ID was not found (id: ${voyageId}).`,
            });
            throw new Error("The voyage with the specified ID was not found.");
          case 405:
            toast({
              variant: "destructive",
              title: "Method Not Allowed",
              description: `Only DELETE method is supported on this endpoint.`,
            });
            throw new Error(
              "Method Not Allowed. Only DELETE method is supported on this endpoint.",
            );
          default:
            throw new Error("Failed to delete the voyage");
        }
      } else {
        toast({
          variant: "default",
          description: `Voyage succesfully deleted.`,
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
    },
  });

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Table>
          <TableHeader>
            <Sheet
              buttonTitle="Create"
              title="Lorem ipsum"
              description="Lorem ipsum"
              open={open}
              setOpen={setOpen}
            >
              <CreateVoyageForm setOpen={setOpen} />
            </Sheet>

            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT,
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>
                  <Popover
                    title={voyage.unitTypes.length.toString()}
                    infoText="Click to see more details"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit Type</TableHead>
                          <TableHead>Default Length</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {voyage.unitTypes.map((unitType) => (
                          <TableRow key={unitType.id}>
                            <TableCell>{unitType.name}</TableCell>
                            <TableCell>{unitType.defaultLength}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Popover>
                </TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
