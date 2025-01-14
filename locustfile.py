from locust import HttpUser, task, between

class MyUser(HttpUser):
    # Random wait time between requests (e.g., 1-5 seconds)
    wait_time = between(1, 5)

    @task
    def send_request(self):
        self.client.get("/")  # Replace with your server's endpoint
