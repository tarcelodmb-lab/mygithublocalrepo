import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [hasRead, setHasRead] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAccept = () => {
    if (hasRead && hasAccepted) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1752173430689_6c674b4a.JPG" 
              alt="CobraFlex Logo" 
              className="h-8 w-8 object-contain" 
            />
            CobraFlex Warranty Terms & Conditions
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          <div className="space-y-4 text-sm">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-blue-800">TRAINING</h3>
              <p className="text-gray-700">
                Upon purchase, CobraFlex or its authorized Dealers will provide comprehensive training on the proper operation, handling, and maintenance of the equipment (hereinafter referred to as the "Machine"). This training includes a digital user manual or user's guide, a detailed training checklist, and documentation on the replacement of consumable parts, standard operating procedures, and preventative maintenance protocols.
              </p>
              
              <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                <p className="font-semibold text-yellow-800">Training Coverage Areas:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-700">
                  <li>Startup and shutdown procedures</li>
                  <li>Print head cleaning and maintenance</li>
                  <li>Ink and adhesive handling</li>
                  <li>Film loading, curing, and transfer procedures</li>
                  <li>Troubleshooting standard errors and software use</li>
                  <li>Proper storage and use of consumables (inks, adhesives, films)</li>
                  <li>Environmental and operational requirements (humidity, ventilation, temperature, etc.)</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-3 rounded-md border-l-4 border-red-400">
                <p className="font-bold text-red-800">MANDATORY TRAINING REQUIREMENT</p>
                <p className="text-red-700 mt-1">
                  Customer attendance and participation in the training is mandatory. Failure to attend or complete the required training voids all warranties, support obligations, and service agreements. CobraFlex will document proof of training and retain certification records for each trained operator.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-blue-800">Remote Technical Support and Service Agreement</h3>
              <p className="text-gray-700">
                CobraFlex Printers shall provide remote technical support and service for the equipment covered under this agreement for a period of twelve (12) months commencing on the date of installation. This service encompasses diagnostic assistance and operational support within the scope of CobraFlex's standard support parameters.
              </p>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="font-semibold text-blue-800">Support Details:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700">
                  <li>Remote support includes phone and virtual assistance only</li>
                  <li>Average response time: 6 business hours</li>
                  <li>Support hours: Monday-Friday, 8:00 AM - 5:00 PM PST</li>
                  <li>After 12 months: $85/hour plus travel expenses</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-blue-800">Customer Responsibilities</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-semibold text-gray-800">You must:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Adhere strictly to all training, operational, and safety guidelines provided</li>
                  <li>Communicate proper handling instructions of end products to all downstream users or customers</li>
                  <li>Ensure any additional operators hired post-installation are trained and certified through CobraFlex prior to use of the equipment</li>
                  <li>Use only CobraFlex-approved consumables and supplies</li>
                  <li>Maintain proper maintenance logs and documentation</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-red-100 p-4 rounded-md border border-red-300">
              <p className="font-bold text-red-800 text-center">WARRANTY VOID CONDITIONS</p>
              <p className="text-red-700 mt-2 text-center">
                Improper use, failure to follow training, use of non-approved consumables, untrained operators, or moving equipment without authorization will IMMEDIATELY VOID all warranties and service agreements.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="read-warranty" 
              checked={hasRead} 
              onCheckedChange={setHasRead}
            />
            <label htmlFor="read-warranty" className="text-sm font-medium">
              I have read and understand the complete warranty terms and conditions
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="accept-warranty" 
              checked={hasAccepted} 
              onCheckedChange={setHasAccepted}
              disabled={!hasRead}
            />
            <label htmlFor="accept-warranty" className="text-sm font-medium">
              I accept the warranty terms and agree to comply with all training and operational requirements
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!hasRead || !hasAccepted}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyModal;