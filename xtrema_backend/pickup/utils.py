import csv
from .models import PickupRequest, UserLogin


def export_pickup_to_csv():
    qs = PickupRequest.objects.all()
    with open('pickup_data.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            'Address', 'Pincode', 'State', 'Landmark', 'Pickup Date',
            'Plastic (kg)', 'Metal (kg)', 'Glass (kg)', 'Wood (kg)', 'Trash (kg)', 'Total Points', 'Created At'
        ])
        for q in qs:
            writer.writerow([
                q.address, q.pincode, q.state, q.landmark, q.pickup_date,
                q.plastic_kg, q.metal_kg, q.glass_kg, q.wood_kg, 
                q.trash_kg, q.total_points, q.created_at
            ])


def export_login_to_csv():
    qs = UserLogin.objects.all()
    with open('login_data.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Email', 'Created At'])
        for q in qs:
            writer.writerow([q.email, q.created_at])
