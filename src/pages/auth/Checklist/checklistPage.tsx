import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import { Loader2 } from "lucide-react";
import { useChecklistContext } from "@c/context/providers/ChecklistProvider";
import { useToast } from "@c/context/providers/ToastProvider";
import { ModalContextService } from "@c/context/ModalContext";
import { Button } from "@c/lib/shadcn/components/ui/button";
import { Card } from "@c/lib/shadcn/components/ui/card";
import type { ChecklistGroupI } from "@c/types/checklistTypes";
import {
  getDefaultChecklistGroupFormValues,
  mapChecklistGroupToFormValues,
} from "@c/types/checklistTypes";
import ChecklistForm from "./components/ChecklistForm";

type ViewMode = "list" | "create" | "edit";

export default function ChecklistPage() {
  const {
    groupList,
    errorList,
    groupForm,
    fields,
    append,
    remove,
    fetchList,
    getGroupDetails,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useChecklistContext();
  const { showToast } = useToast();
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const [mode, setMode] = useState<ViewMode>("list");
  const [editingGroup, setEditingGroup] = useState<ChecklistGroupI | null>(
    null,
  );
  const [openingGroupId, setOpeningGroupId] = useState<
    ChecklistGroupI["id"] | null
  >(null);

  useEffect(() => {
    fetchList();
  }, []);

  const handleNewChecklist = () => {
    groupForm?.reset(getDefaultChecklistGroupFormValues());
    setEditingGroup(null);
    setMode("create");
  };

  const handleEditGroup = async (group: ChecklistGroupI) => {
    if (openingGroupId !== null) return;
    setOpeningGroupId(group.id);
    try {
      const fullGroup = await getGroupDetails(group.id);
      if (!fullGroup) {
        showToast({
          message: "Failed to load checklist for editing.",
          variant: "danger",
        });
        return;
      }
      groupForm?.reset(mapChecklistGroupToFormValues(fullGroup));
      setEditingGroup(fullGroup);
      setMode("edit");
    } finally {
      setOpeningGroupId(null);
    }
  };

  const handleCancelForm = () => {
    groupForm?.reset(getDefaultChecklistGroupFormValues());
    setEditingGroup(null);
    setMode("list");
  };

  const handleFormSuccess = () => {
    const wasEditing = mode === "edit";
    setEditingGroup(null);
    setMode("list");
    showToast({
      message: wasEditing
        ? "Checklist updated successfully."
        : "Checklist created successfully.",
      variant: "success",
    });
  };

  const handleDeleteGroup = (group: ChecklistGroupI) => {
    confirmModalConfig({
      title: `Delete "${group.title}"?`,
      description:
        "This checklist and all of its items will be permanently deleted.",
    });
    handleConfirm(async () => {
      const success = await deleteGroup(group.id);
      if (success) {
        if (editingGroup?.id === group.id) {
          groupForm?.reset(getDefaultChecklistGroupFormValues());
          setEditingGroup(null);
          setMode("list");
        }
        showToast({
          message: "Checklist deleted successfully.",
          variant: "success",
        });
      }
    });
    onOpen();
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4 sm:gap-5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Checklist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan grocery/shopping lists you can reuse when logging expenses.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="w-full sm:w-auto"
          onClick={handleNewChecklist}
        >
          <BiPlus size={17} />
          New Checklist
        </Button>
      </div>

      <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-5">
        <div className="flex w-full flex-col gap-2 lg:w-72 lg:shrink-0">
          <div className="flex items-baseline gap-2 px-1">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Your Lists
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {(groupList ?? []).length}
            </span>
          </div>

          {(groupList ?? []).length === 0 ? (
            <div className="flex flex-col items-center gap-1 rounded-2xl border bg-card py-10 text-center">
              <span className="text-sm font-semibold">No checklists yet</span>
              <span className="px-4 text-xs text-muted-foreground">
                Create a checklist to start planning your next shopping trip.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {(groupList ?? []).map((group) => {
                const isActive =
                  mode === "edit" && editingGroup?.id === group.id;
                const isOpening = openingGroupId === group.id;
                return (
                  <Card
                    key={group.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${group.title}`}
                    aria-busy={isOpening}
                    onClick={() => handleEditGroup(group)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleEditGroup(group);
                      }
                    }}
                    className={`cursor-pointer gap-1.5 rounded-2xl p-3.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none ${
                      isActive
                        ? "ring-2 ring-primary/40"
                        : "hover:border-foreground/20"
                    } ${isOpening ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight">
                        {group.title}
                      </span>
                      <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {group.items_count ?? 0} item(s)
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {group.description || "No description"}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1">
                      {isOpening && (
                        <Loader2
                          size={14}
                          className="mr-auto animate-spin text-muted-foreground"
                        />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Delete checklist"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group);
                        }}
                      >
                        <CiTrash size={16} />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full min-w-0 flex-1">
          {mode !== "list" ? (
            groupForm && (
              <ChecklistForm
                groupForm={groupForm}
                fields={fields}
                append={append}
                remove={remove}
                onSubmit={
                  mode === "edit" && editingGroup
                    ? (data) => updateGroup(editingGroup.id, data)
                    : createGroup
                }
                submitLabel={
                  mode === "edit" ? "Save Changes" : "Submit Checklist"
                }
                confirmTitle={
                  mode === "edit"
                    ? "Save changes to this checklist?"
                    : "Create this checklist?"
                }
                confirmDescription={
                  mode === "edit"
                    ? "The checklist and its items will be updated with your changes."
                    : "The checklist and its items will be saved to your lists."
                }
                errorList={errorList}
                onCancel={handleCancelForm}
                onSuccess={handleFormSuccess}
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed bg-card py-14 text-center">
              <span className="text-sm font-semibold">
                Select a checklist to view or edit
              </span>
              <span className="max-w-[320px] px-4 text-sm text-muted-foreground">
                Or create a new checklist to start planning your next shopping
                trip.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
