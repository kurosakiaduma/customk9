interface TermsAcceptanceProps {
    onAccept: (accepted: boolean) => void;
    isAccepted: boolean;
}

export default function TermsAcceptance({ onAccept, isAccepted }: TermsAcceptanceProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
                <p className="text-gray-600 mb-6">
                    Please read and accept our terms and conditions to complete your booking.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="prose prose-sm max-w-none">
                    <h3>Training Session Terms</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Please arrive 5-10 minutes before your scheduled session time.</li>
                        <li>Bring your dog's vaccination records to the first session.</li>
                        <li>Dogs must be on a leash when entering and exiting the facility.</li>
                        <li>Bring water and treats for your dog.</li>
                        <li>Cancellations must be made at least 24 hours in advance.</li>
                    </ul>

                    <h3 className="mt-6">Health & Safety</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Dogs must be up to date on vaccinations.</li>
                        <li>Dogs showing signs of illness should not attend training.</li>
                        <li>Owners are responsible for their dog's behavior.</li>
                        <li>The trainer may terminate a session if a dog shows aggressive behavior.</li>
                    </ul>

                    <h3 className="mt-6">Payment Policy</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Payment is required at the time of booking.</li>
                        <li>No refunds for missed sessions without 24-hour notice.</li>
                        <li>Package sessions must be used within 6 months of purchase.</li>
                    </ul>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) => onAccept(e.target.checked)}
                            checked={isAccepted}
                        />
                        <span className="ml-3 text-sm text-gray-600">
                            I have read and agree to the terms and conditions, including the cancellation policy and health requirements.
                            I understand that by checking this box, I am agreeing to comply with all stated policies.
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
} 