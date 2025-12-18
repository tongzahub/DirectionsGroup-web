import React, { useState } from 'react';
import { Box, Typography, Flex, Button, Badge, Modal, ModalLayout, ModalHeader, ModalBody, ModalFooter, Textarea } from '@strapi/design-system';
import { Check, Cross, Clock, Message } from '@strapi/icons';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  assignee?: string;
  completedAt?: Date;
  comments?: string;
}

interface WorkflowManagerProps {
  contentId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string, comments?: string) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  contentId,
  currentStatus,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'draft',
      name: 'Content Creation',
      status: currentStatus === 'draft' ? 'in_review' : 'approved',
    },
    {
      id: 'content_review',
      name: 'Content Review',
      status: currentStatus === 'content_review' ? 'in_review' : 
             currentStatus === 'draft' ? 'pending' : 'approved',
      assignee: 'Content Team',
    },
    {
      id: 'brand_review',
      name: 'Brand Guidelines Review',
      status: currentStatus === 'brand_review' ? 'in_review' : 
             ['draft', 'content_review'].includes(currentStatus) ? 'pending' : 'approved',
      assignee: 'Brand Manager',
    },
    {
      id: 'final_approval',
      name: 'Final Approval',
      status: currentStatus === 'final_approval' ? 'in_review' : 
             ['draft', 'content_review', 'brand_review'].includes(currentStatus) ? 'pending' : 'approved',
      assignee: 'Marketing Director',
    },
    {
      id: 'published',
      name: 'Published',
      status: currentStatus === 'published' ? 'approved' : 'pending',
    },
  ];

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'approved':
        return <Check color="success600" />;
      case 'rejected':
        return <Cross color="danger600" />;
      case 'in_review':
        return <Clock color="warning600" />;
      default:
        return <Clock color="neutral400" />;
    }
  };

  const getStatusBadge = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'in_review':
        return <Badge variant="warning">In Review</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleAction = (action: 'approve' | 'reject') => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedAction) {
      const nextStatus = selectedAction === 'approve' ? getNextStatus() : 'rejected';
      onStatusChange(nextStatus, comments);
      setIsModalOpen(false);
      setComments('');
      setSelectedAction(null);
    }
  };

  const getNextStatus = () => {
    const statusOrder = ['draft', 'content_review', 'brand_review', 'final_approval', 'published'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[currentIndex + 1] || 'published';
  };

  const canApprove = () => {
    return ['content_review', 'brand_review', 'final_approval'].includes(currentStatus);
  };

  const canReject = () => {
    return ['content_review', 'brand_review', 'final_approval'].includes(currentStatus);
  };

  return (
    <Box padding={4} background="neutral0" borderRadius="4px" shadow="filterShadow" marginBottom={4}>
      <Typography variant="beta" textColor="neutral800" marginBottom={4}>
        Content Approval Workflow
      </Typography>

      {/* Workflow Steps */}
      <Box marginBottom={4}>
        {workflowSteps.map((step, index) => (
          <Flex key={step.id} alignItems="center" gap={3} marginBottom={3}>
            <Box minWidth="24px">
              {getStatusIcon(step.status)}
            </Box>
            <Box flex="1">
              <Flex alignItems="center" gap={2} marginBottom={1}>
                <Typography variant="omega" fontWeight="semiBold" textColor="neutral800">
                  {step.name}
                </Typography>
                {getStatusBadge(step.status)}
              </Flex>
              {step.assignee && (
                <Typography variant="pi" textColor="neutral600">
                  Assigned to: {step.assignee}
                </Typography>
              )}
            </Box>
            {index < workflowSteps.length - 1 && (
              <Box width="2px" height="20px" background="neutral300" />
            )}
          </Flex>
        ))}
      </Box>

      {/* Action Buttons */}
      {(canApprove() || canReject()) && (
        <Flex gap={2} justifyContent="flex-end">
          {canReject() && (
            <Button
              variant="danger-light"
              startIcon={<Cross />}
              onClick={() => handleAction('reject')}
            >
              Reject
            </Button>
          )}
          {canApprove() && (
            <Button
              variant="success"
              startIcon={<Check />}
              onClick={() => handleAction('approve')}
            >
              Approve
            </Button>
          )}
        </Flex>
      )}

      {/* Action Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ModalLayout>
            <ModalHeader>
              <Typography fontWeight="bold" textColor="neutral800" as="h2">
                {selectedAction === 'approve' ? 'Approve Content' : 'Reject Content'}
              </Typography>
            </ModalHeader>
            <ModalBody>
              <Box>
                <Typography variant="omega" textColor="neutral700" marginBottom={3}>
                  {selectedAction === 'approve' 
                    ? 'Are you sure you want to approve this content and move it to the next stage?'
                    : 'Please provide feedback on why this content is being rejected.'
                  }
                </Typography>
                <Textarea
                  placeholder={selectedAction === 'approve' 
                    ? 'Optional: Add approval comments...'
                    : 'Required: Explain what needs to be changed...'
                  }
                  value={comments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                />
              </Box>
            </ModalBody>
            <ModalFooter
              startActions={
                <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              }
              endActions={
                <Button
                  variant={selectedAction === 'approve' ? 'success' : 'danger'}
                  onClick={confirmAction}
                  disabled={selectedAction === 'reject' && !comments.trim()}
                >
                  {selectedAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              }
            />
          </ModalLayout>
        </Modal>
      )}

      {/* Workflow History */}
      <Box marginTop={4} padding={3} background="neutral100" borderRadius="4px">
        <Typography variant="delta" textColor="neutral800" marginBottom={2}>
          Workflow History
        </Typography>
        <Typography variant="pi" textColor="neutral600">
          <Message style={{ marginRight: '8px' }} />
          Track all approval actions and comments here. (This would be populated from database records)
        </Typography>
      </Box>
    </Box>
  );
};