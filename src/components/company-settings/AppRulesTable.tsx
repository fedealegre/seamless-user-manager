
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { AppRule } from "@/contexts/CompanySettingsContext";
import EditRuleDialog from "./EditRuleDialog";

interface AppRulesTableProps {
  rules: AppRule[];
  onUpdateRule: (updatedRule: AppRule) => void;
}

const AppRulesTable: React.FC<AppRulesTableProps> = ({ rules, onUpdateRule }) => {
  const [selectedRule, setSelectedRule] = useState<AppRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (rule: AppRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRule(null);
  };

  const handleSaveRule = (updatedRule: AppRule) => {
    onUpdateRule(updatedRule);
    setIsDialogOpen(false);
    setSelectedRule(null);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Rule Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.key}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                <div className="max-w-[400px] truncate">{rule.value}</div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(rule)}
                >
                  <Edit size={16} />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRule && (
        <EditRuleDialog
          rule={selectedRule}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveRule}
          onCancel={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default AppRulesTable;
